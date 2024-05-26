import React, { useCallback, useEffect, useState } from 'react';
import PrismaZoom from 'react-prismazoom';
import { Note } from 'src/types/types';
import { generateKey } from 'src/utils/generateKey';
import { getStorageNotes } from 'src/utils/getStorageNotes';

type Props = {
  imageId: string;
  imageUrl: string;
};

const INPUT_WIDTH = 146;
const INPUT_HEIGHT = 26;

export const CarouselCard = ({ imageId, imageUrl }: Props): JSX.Element => {
  const [inputs, setInputs] = useState<Note[]>([]);
  const [focusedKey, setFocusedKey] = useState('');
  const [newNote, setNewNote] = useState<Note | null>(null);
  const [selectedInputKey, setSelectedInputKey] = useState('');

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'd' && focusedKey) {
        setInputs((prev) => prev.filter((el) => el.key !== focusedKey));
        setFocusedKey('');
      }
    },
    [focusedKey]
  );

  useEffect(() => {
    const storageData = getStorageNotes();
    const defaultData = storageData.find((note) => note.id === imageId)?.notes ?? [];

    setInputs(defaultData);
  }, [imageId, setInputs]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    const timerId = setInterval(() => {
      const prevNotes = getStorageNotes();

      const isExistImg = !!prevNotes.find((el) => el.id === imageId);
      const updatedNotes = prevNotes.map((note) => (note.id === imageId ? { ...note, notes: inputs } : note));

      localStorage.setItem(
        'notes',
        JSON.stringify(isExistImg ? updatedNotes : [...prevNotes, { id: imageId, notes: inputs }])
      );
    }, 5000);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(timerId);
    };
  }, [handleKeyDown, inputs, imageId]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const x =
      e.nativeEvent.offsetX + INPUT_WIDTH > e.currentTarget.offsetWidth
        ? e.currentTarget.offsetWidth - INPUT_WIDTH
        : e.nativeEvent.offsetX;
    const y =
      e.nativeEvent.offsetY + INPUT_HEIGHT > e.currentTarget.offsetHeight
        ? e.currentTarget.offsetHeight - INPUT_HEIGHT
        : e.nativeEvent.offsetY;
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
      <div className='img-wrapper'>
        <PrismaZoom
          scrollVelocity={0.3}
          minZoom={1}
          maxZoom={2}
          doubleTouchMaxDelay={0}
          onClick={(e) => {
            handleClick(e);
          }}
        >
          <img className='carousel-img' src={imageUrl} alt='carousel-image' />

          {newNote && (
            <input
              className='note-input'
              key={`input-${newNote.key}`}
              type='text'
              style={{ position: 'absolute', left: newNote.x, top: newNote.y + 2 }}
              value={newNote.text}
              onChange={(e) => setNewNote((prev) => (prev ? { ...prev, text: e.currentTarget.value } : prev))}
              onBlur={handleAddNew}
              onKeyDown={(e) => {
                setFocusedKey('');

                if (e.key === 'Enter') e.currentTarget.blur();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              autoFocus
            />
          )}

          {inputs.map((el) =>
            el.key === selectedInputKey ? (
              <input
                className='note-input'
                key={`input-${el.key}`}
                type='text'
                style={{ position: 'absolute', left: el.x, top: el.y + 2 }}
                value={el.text}
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
                onClick={(e) => {
                  e.stopPropagation();
                }}
                autoFocus
              />
            ) : (
              <p
                key={`text-${el.key}`}
                style={{ left: el.x, top: el.y }}
                className={`note ${focusedKey === el.key ? 'focused' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();

                  setFocusedKey(el.key);
                  handleAddNew();

                  if (el.key === focusedKey) {
                    setSelectedInputKey(el.key);
                    setFocusedKey('');
                  }
                }}
              >
                {el.text}
              </p>
            )
          )}
        </PrismaZoom>
      </div>
    </div>
  );
};
