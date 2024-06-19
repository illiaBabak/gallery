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
  setShouldShowSavedIcon: React.Dispatch<React.SetStateAction<boolean>>;
};

const getCurrentCoords = (
  { currentTarget, nativeEvent }: React.MouseEvent<HTMLDivElement>,
  input: React.MutableRefObject<HTMLInputElement | null>
): { x: number; y: number } => {
  const { width = 1, height = 1 } = input.current?.getBoundingClientRect() ?? {};
  const { offsetHeight, offsetWidth } = currentTarget;
  const { offsetX, offsetY } = nativeEvent;

  const x = offsetX + width > offsetWidth ? offsetWidth - width : offsetX;
  const y = offsetY + height > offsetHeight ? offsetHeight - height : offsetY;

  return { x, y };
};

const getDroppedCoords = (
  { nativeEvent, currentTarget }: React.MouseEvent<HTMLDivElement>,
  draggableText: React.MutableRefObject<HTMLParagraphElement | null>
): { x: number; y: number } => {
  const { offsetHeight, offsetWidth } = currentTarget;
  const { offsetX, offsetY } = nativeEvent;

  const { width = 1, height = 1 } = draggableText.current?.getBoundingClientRect() ?? {};

  const beyondRight = offsetX + width > offsetWidth;
  const beyondBottom = offsetY + height > offsetHeight;

  const x = beyondRight ? offsetWidth - width : offsetX;
  const y = beyondBottom ? offsetHeight - height : offsetY;

  return { x, y };
};

export const CarouselCard = ({
  imageId,
  imageUrl,
  draggedNoteKey,
  setDraggedNoteKey,
  setShouldShowSavedIcon,
}: Props): JSX.Element => {
  const [inputs, setInputs] = useState<Note[]>([]);
  const [focusedKey, setFocusedKey] = useState('');
  const [newNote, setNewNote] = useState<Note | null>(null);
  const [selectedInputKey, setSelectedInputKey] = useState('');

  const inputEl = useRef<HTMLInputElement | null>(null);
  const draggableText = useRef<HTMLParagraphElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'd' && focusedKey) {
        setInputs((prev) => prev.filter((el) => el.key !== focusedKey));
        setFocusedKey('');
      }
    },
    [focusedKey]
  );

  useNotesAutoSave({ imageId, inputs, setShouldShowSavedIcon });

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
    const { x, y } = getCurrentCoords(e, inputEl);
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const { x, y } = getDroppedCoords(e, draggableText);

    setInputs((prev) => prev.map((note) => (note.key === draggedNoteKey ? { ...note, x, y } : note)));

    setDraggedNoteKey('');
    draggableText.current = null;
  };

  return (
    <div className='carousel-card'>
      <div className='img-wrapper' onClick={handleClick} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        <PrismaZoom scrollVelocity={0.3} minZoom={1} maxZoom={2} doubleTouchMaxDelay={0}>
          <img className='carousel-img' src={imageUrl} alt='carousel-image' />
        </PrismaZoom>

        <NoteInput
          key={newNote ? 'active' : ''}
          note={newNote}
          ref={inputEl}
          onChange={({ currentTarget: { value } }) => setNewNote((prev) => (prev ? { ...prev, text: value } : prev))}
          onBlur={handleAddNew}
          onKeyDown={({ key, currentTarget }) => {
            setFocusedKey('');

            if (key === 'Enter') currentTarget.blur();
          }}
          className={newNote ? '' : 'hidden'}
        />

        {inputs.map((el) =>
          el.key === selectedInputKey ? (
            <NoteInput
              note={el}
              onChange={({ currentTarget: { value } }) => {
                setInputs((prevInputs) =>
                  prevInputs.map((input) => (input.key === el.key ? { ...input, text: value } : input))
                );
              }}
              onBlur={handleInputBlur}
              onKeyDown={({ key, currentTarget }) => {
                setFocusedKey('');

                if (key === 'Enter') currentTarget.blur();
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
                  return;
                }

                setFocusedKey(el.key);
              }}
              draggable
              onDragStart={(e) => {
                setDraggedNoteKey(el.key);

                draggableText.current = e.currentTarget;
              }}
              onDragEnd={() => setDraggedNoteKey('')}
            >
              {el.text}
            </p>
          )
        )}
      </div>
    </div>
  );
};
