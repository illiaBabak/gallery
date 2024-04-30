import { StorageNotes } from 'src/types/types';
import { isStorageNotesArr } from './guards';

export const getStorageNotes = (): StorageNotes[] => {
  const localStorageNotes = localStorage.getItem('notes');
  const storageNotes: unknown = localStorageNotes ? JSON.parse(localStorageNotes) : '';
  const parsedStorageNotes = isStorageNotesArr(storageNotes) ? storageNotes : [];

  return parsedStorageNotes;
};
