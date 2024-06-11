import { useSearchParams } from 'react-router-dom';

export const Header = (): JSX.Element => {
  const [, setSearchParams] = useSearchParams();

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
            onBlur={(e) => {
              const trimmedVal = e.currentTarget.value.trim();

              if (!trimmedVal) {
                setSearchParams((prev) => {
                  prev.delete('query');
                  return prev;
                });

                return;
              }

              setSearchParams({ query: trimmedVal });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
            }}
          />
        </div>
        <div className='clear-btn' onClick={() => setSearchParams({ query: '' })}>
          x
        </div>
      </div>
    </div>
  );
};
