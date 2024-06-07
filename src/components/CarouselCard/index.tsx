import React, { useCallback, useEffect, useRef, useState } from 'react';
import PrismaZoom from 'react-prismazoom';
import { useNotesAutoSave } from 'src/hooks/useNotesAutoSave';
import { Note } from 'src/types/types';
import { generateKey } from 'src/utils/generateKey';
import { getStorageNotes } from 'src/utils/getStorageNotes';
import { NoteInput } from './components/NoteInput';

type Props = {
  imageId: string;
  imageUrl: string;
  draggedNoteKey: string;
  setDraggedNoteKey: React.Dispatch<React.SetStateAction<string>>;
};

const getCurrentCoords = (
  e: React.MouseEvent<HTMLDivElement>,
  inputWidth: number,
  inputHeight: number
): { x: number; y: number } => {
  const x =
    e.nativeEvent.offsetX + inputWidth > e.currentTarget.offsetWidth
      ? e.currentTarget.offsetWidth - inputWidth
      : e.nativeEvent.offsetX;
  const y =
    e.nativeEvent.offsetY + inputHeight > e.currentTarget.offsetHeight
      ? e.currentTarget.offsetHeight - inputHeight
      : e.nativeEvent.offsetY;

  return { x, y };
};

export const CarouselCard = ({ imageId, imageUrl, draggedNoteKey, setDraggedNoteKey }: Props): JSX.Element => {
  const [inputs, setInputs] = useState<Note[]>([]);
  const [focusedKey, setFocusedKey] = useState('');
  const [newNote, setNewNote] = useState<Note | null>(null);
  const [selectedInputKey, setSelectedInputKey] = useState('');
  const inputEl = useRef<HTMLInputElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'd' && focusedKey) {
        setInputs((prev) => prev.filter((el) => el.key !== focusedKey));
        setFocusedKey('');
      }
    },
    [focusedKey]
  );

  useNotesAutoSave({ imageId, inputs });

  useEffect(() => {
    const storageData = getStorageNotes();
    const defaultData = storageData.find((note) => note.id === imageId)?.notes ?? [];

    setInputs(defaultData);
  }, [imageId, setInputs]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { x, y } = getCurrentCoords(
      e,
      inputEl.current?.getBoundingClientRect().width ?? 1,
      inputEl.current?.getBoundingClientRect().height ?? 1
    );
    const uniqueKey = generateKey();

    setNewNote({ x, y, text: '', key: uniqueKey });
    setFocusedKey('');
  };

  const handleAddNew = () => {
    if (!newNote) return;

    setInputs((prevInputs) => [...prevInputs, newNote]);

    setNewNote(null);
  };

  const handleInputBlur = () => setSelectedInputKey('');

  return (
    <div className='carousel-card'>
      <div
        className='img-wrapper'
        onClick={handleClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.stopPropagation();

          const updatedNotes = inputs.map((note) =>
            note.key === draggedNoteKey ? { ...note, x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY } : note
          );

          setInputs(updatedNotes);
          setDraggedNoteKey('');
        }}
      >
        <PrismaZoom scrollVelocity={0.3} minZoom={1} maxZoom={2} doubleTouchMaxDelay={0}>
          <img className='carousel-img' src={imageUrl} alt='carousel-image' />
        </PrismaZoom>

        {newNote && (
          <NoteInput
            note={newNote}
            onChange={(e) => setNewNote((prev) => (prev ? { ...prev, text: e.currentTarget.value } : prev))}
            onBlur={handleAddNew}
            onKeyDown={(e) => {
              setFocusedKey('');

              if (e.key === 'Enter') e.currentTarget.blur();
            }}
          />
        )}

        {inputs.map((el) =>
          el.key === selectedInputKey ? (
            <NoteInput
              note={el}
              onChange={(e) => {
                const val = e.currentTarget.value;

                setInputs((prevInputs) =>
                  prevInputs.map((input) => (input.key === el.key ? { ...input, text: val } : input))
                );
              }}
              onBlur={handleInputBlur}
              onKeyDown={(e) => {
                setFocusedKey('');

                if (e.key === 'Enter') e.currentTarget.blur();
              }}
            />
          ) : (
            <p
              key={`text-${el.key}`}
              style={{ left: el.x, top: el.y }}
              className={`note ${focusedKey === el.key ? 'focused' : ''} ${draggedNoteKey === el.key ? 'dragged-note' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                if (el.key === focusedKey) {
                  setSelectedInputKey(el.key);
                  setFocusedKey('');
                } else setFocusedKey(el.key);
              }}
              draggable
              onDragStart={() => setDraggedNoteKey(el.key)}
            >
              {el.text}
            </p>
          )
        )}
        <input className='note-input' ref={inputEl} style={{ visibility: 'hidden', position: 'absolute' }} />
      </div>
    </div>
  );
};
