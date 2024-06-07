import { Note } from 'src/types/types';

type Props = {
  note: Note;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const NoteInput = ({ note, onChange, onBlur, onKeyDown }: Props): JSX.Element => {
  return (
    <input
      className='note-input'
      key={`input-${note.key}`}
      type='text'
      style={{ position: 'absolute', left: note.x, top: note.y }}
      value={note.text}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onClick={(e) => e.stopPropagation()}
      autoFocus
    />
  );
};
