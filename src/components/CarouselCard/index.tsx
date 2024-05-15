import React, { useEffect, useState } from 'react';
import PrismaZoom from 'react-prismazoom';
import { Note } from 'src/types/types';
import { getStorageNotes } from 'src/utils/getStorageNotes';

type Props = {
  imageId: string;
  imageUrl: string;
};

export const CarouselCard = ({ imageId, imageUrl }: Props): JSX.Element => {
  const [inputs, setInputs] = useState<Note[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    const storageData = getStorageNotes();
    const defaultData = storageData.find((note) => note.id === imageId)?.notes ?? [];

    setInputs(defaultData);
  }, [imageId, setInputs]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    setInputs([...inputs, { x, y, text: '' }]);
    setEditingIndex(inputs.length);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) =>
    setInputs((prevInputs) => prevInputs.map((input, i) => (i === index ? { ...input, text: e.target.value } : input)));

  const handleInputBlur = (index: number) => {
    setEditingIndex(null);

    setInputs((prevInputs) =>
      prevInputs.map((input, i) => (i === index ? { ...input, text: input.text.trim() } : input))
    );

    const prevNotes = getStorageNotes();
    const newNote = { id: imageId, notes: inputs };
    const existImg = prevNotes.find((el) => el.id === imageId);

    const updatedNotes = prevNotes.map((note) => (note.id === imageId ? { ...note, notes: inputs } : note));

    localStorage.setItem('notes', JSON.stringify(existImg ? updatedNotes : [...prevNotes, newNote]));
  };

  return (
    <div className='carousel-card'>
      <div className='img-wrapper'>
        <PrismaZoom
          scrollVelocity={0.3}
          minZoom={1}
          maxZoom={2}
          doubleTouchMaxDelay={0}
          onClick={(e) => handleClick(e)}
        >
          <img className='carousel-img' src={imageUrl} alt='carousel-image' />

          {inputs.map((el, index) =>
            editingIndex === index ? (
              <input
                className='note-input'
                key={`input-${index}`}
                type='text'
                style={{ position: 'absolute', left: el.x, top: el.y + 15 }}
                value={el.text}
                onChange={(e) => handleInputChange(e, index)}
                onBlur={() => handleInputBlur(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.currentTarget.blur();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                autoFocus
              />
            ) : (
              <p key={`text-${index}`} style={{ left: el.x, top: el.y }} className='note'>
                {el.text}
              </p>
            )
          )}
        </PrismaZoom>
      </div>
    </div>
  );
};
