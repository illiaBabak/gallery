type Props = {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

export const Header = ({ setSearchQuery }: Props): JSX.Element => {
  return (
    <div className='header'>
      <h1>Gallery</h1>
      <div className='search-wrapper'>
        <div className='search'>
          <img className='search-img' src='https://cdn-icons-png.freepik.com/512/9135/9135995.png' alt='search-img' />
          <input
            type='text'
            className='search-input'
            placeholder='Search here...'
            onBlur={(e) => setSearchQuery(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
            }}
          />
        </div>
        <div className='clear-btn' onClick={() => setSearchQuery('')}>
          x
        </div>
      </div>
    </div>
  );
};
