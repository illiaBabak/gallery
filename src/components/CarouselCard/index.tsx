import React, { useCallback, useEffect, useState } from 'react';
import PrismaZoom from 'react-prismazoom';
import { Note } from 'src/types/types';
import { generateKey } from 'src/utils/generateKey';
import { getStorageNotes } from 'src/utils/getStorageNotes';

type Props = {
  imageId: string;
  imageUrl: string;
};

export const CarouselCard = ({ imageId, imageUrl }: Props): JSX.Element => {
  const [inputs, setInputs] = useState<Note[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [newNote, setNewNote] = useState<Note | null>(null);
  const [selectedInputKey, setSelectedInputKey] = useState('');

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'd' && typeof focusedIndex === 'number') {
        setInputs((prev) => prev.filter((_, index) => index !== focusedIndex));
        setFocusedIndex(null);
      }
    },
    [focusedIndex]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const storageData = getStorageNotes();
    const defaultData = storageData.find((note) => note.id === imageId)?.notes ?? [];

    setInputs(defaultData);
  }, [imageId, setInputs]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const uniqueKey = generateKey();

    setNewNote({ x, y, text: '', key: uniqueKey });
  };

  const handleAddNew = () => {
    if (!newNote) return;

    setInputs((prevInputs) => [...prevInputs, newNote]);

    const prevNotes = getStorageNotes();
    const newStorageNote = { id: imageId, notes: [...inputs, newNote] };
    const isExistImg = !!prevNotes.find((el) => el.id === imageId);
    const updatedNotes = prevNotes.map((note) =>
      note.id === imageId ? { ...note, notes: [...inputs, newNote] } : note
    );

    localStorage.setItem('notes', JSON.stringify(isExistImg ? updatedNotes : [...prevNotes, newStorageNote]));

    setNewNote(null);
  };

  const handleInputBlur = () => {
    setSelectedInputKey('');

    const prevNotes = getStorageNotes();
    const updatedNotes = prevNotes.map((note) => (note.id === imageId ? { ...note, notes: inputs } : note));

    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

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
                setFocusedIndex(null);

                if (e.key === 'Enter') e.currentTarget.blur();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              autoFocus
            />
          )}

          {inputs.map((el, index) =>
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
                  setFocusedIndex(null);

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
                className='note'
                onMouseEnter={() => setFocusedIndex(index)}
                onMouseLeave={() => setFocusedIndex(null)}
                onClick={() => {
                  setSelectedInputKey(el.key);
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
