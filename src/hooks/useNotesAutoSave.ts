import { useEffect } from 'react';
import { Note } from 'src/types/types';
import { getStorageNotes } from 'src/utils/getStorageNotes';

type Props = {
  imageId: string;
  inputs: Note[];
  setShouldShowSavedIcon: React.Dispatch<React.SetStateAction<boolean>>;
};

const TIMER_DELAY = 5000;

export const useNotesAutoSave = ({ imageId, inputs, setShouldShowSavedIcon }: Props): void => {
  useEffect(() => {
    const timerId = setInterval(() => {
      const prevNotes = getStorageNotes();

      const isExistImg = !!prevNotes.find((el) => el.id === imageId);

      const updatedNotes = isExistImg
        ? prevNotes.map((notesList) => (notesList.id === imageId ? { ...notesList, notes: inputs } : notesList))
        : [...prevNotes, { id: imageId, notes: inputs }];

      localStorage.setItem('notes', JSON.stringify(updatedNotes));

      setShouldShowSavedIcon(true);
    }, TIMER_DELAY);

    return () => clearInterval(timerId);
  }, [inputs, imageId, setShouldShowSavedIcon]);
};
