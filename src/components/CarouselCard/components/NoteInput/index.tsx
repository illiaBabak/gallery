import { forwardRef } from 'react';
import { Note } from 'src/types/types';

type Props = {
  note: Note | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
};

export const NoteInput = forwardRef<HTMLInputElement, Props>(
  ({ note, onChange, onBlur, onKeyDown, className = '' }, ref): JSX.Element => (
    <input
      ref={ref}
      className={`note-input ${className}`}
      type='text'
      style={{ left: note?.x, top: note?.y }}
      value={note?.text}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onClick={(e) => e.stopPropagation()}
      autoFocus
    />
  )
);
