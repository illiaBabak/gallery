import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const Header = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('query') ?? '';

  const [searchVal, setSearchVal] = useState(searchQuery);

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
            value={searchVal}
            onChange={({ currentTarget: { value } }) => setSearchVal(value)}
            onBlur={({ currentTarget: { value } }) => {
              const trimmedVal = value.trim();

              setSearchParams((prev) => {
                trimmedVal ? prev.set('query', trimmedVal) : prev.delete('query');
                return prev;
              });
            }}
            onKeyDown={({ key, currentTarget }) => key === 'Enter' && currentTarget.blur()}
          />
        </div>
        <div
          className='clear-btn'
          onClick={() => {
            setSearchParams({});
            setSearchVal('');
          }}
        >
          x
        </div>
      </div>
    </div>
  );
};
