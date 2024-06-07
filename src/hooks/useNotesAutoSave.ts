import { useEffect } from 'react';
import { Note } from 'src/types/types';
import { getStorageNotes } from 'src/utils/getStorageNotes';

type Props = {
  imageId: string;
  inputs: Note[];
};

const TIMER_DELAY = 10000;

export const useNotesAutoSave = ({ imageId, inputs }: Props): void => {
  useEffect(() => {
    const timerId = setInterval(() => {
      const prevNotes = getStorageNotes();

      const isExistImg = !!prevNotes.find((el) => el.id === imageId);

      const updatedNotes = isExistImg
        ? prevNotes.map((notesList) => (notesList.id === imageId ? { ...notesList, notes: inputs } : notesList))
        : [...prevNotes, { id: imageId, notes: inputs }];

      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }, TIMER_DELAY);

    return () => clearInterval(timerId);
  }, [inputs, imageId]);
};
