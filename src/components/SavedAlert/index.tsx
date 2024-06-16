type Props = {
  setShouldShowSavedIcon: React.Dispatch<React.SetStateAction<boolean>>;
};

const TIMEOUT_DELAY = 3000;

export const SavedAlert = ({ setShouldShowSavedIcon }: Props): JSX.Element => {
  return (
    <div
      className='saved-alert'
      onAnimationEnd={() => {
        setTimeout(() => {
          setShouldShowSavedIcon(false);
        }, TIMEOUT_DELAY);
      }}
    >
      <img
        className='saved-icon'
        src='https://static-00.iconduck.com/assets.00/success-icon-512x512-qdg1isa0.png'
        alt='Saved-icon'
      />
      <p>Data saved</p>
    </div>
  );
};
