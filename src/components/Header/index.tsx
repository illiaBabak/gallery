import { useContext, useState } from 'react';
import { GlobalContext } from 'src/root';

export const Header = (): JSX.Element => {
  const { setSearchQuery, shouldShowCarousel } = useContext(GlobalContext);
  const [searchVal, setSearchVal] = useState('');

  return (
    <div className='header'>
      <h1>Gallery</h1>

      <div className='search-wrapper'>
        <div className={`search ${shouldShowCarousel && 'disabled'}`}>
          <img className='search-img' src='https://cdn-icons-png.freepik.com/512/9135/9135995.png' alt='search-img' />
          <input
            type='text'
            className='search-input'
            placeholder='Search here...'
            value={searchVal}
            onChange={shouldShowCarousel ? () => {} : (e) => setSearchVal(e.currentTarget.value)}
            onBlur={() => setSearchQuery(searchVal)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
            }}
          />
        </div>
        <div
          className={`clear-btn ${shouldShowCarousel && 'disabled'}`}
          onClick={shouldShowCarousel ? () => {} : () => setSearchVal('')}
        >
          x
        </div>
      </div>
    </div>
  );
};
