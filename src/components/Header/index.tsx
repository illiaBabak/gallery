import { useContext, useState } from 'react';
import { GlobalContext } from 'src/root';

export const Header = (): JSX.Element => {
  const { setSearchQuery } = useContext(GlobalContext);
  const [searchVal, setSearchVal] = useState('');

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
            onChange={(e) => setSearchVal(e.currentTarget.value)}
            onBlur={() => setSearchQuery(searchVal)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
            }}
          />
        </div>
        <div className='clear-btn' onClick={() => setSearchVal('')}>
          x
        </div>
      </div>
    </div>
  );
};
