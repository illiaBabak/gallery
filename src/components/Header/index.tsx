export const Header = (): JSX.Element => {
  return (
    <div className='header'>
      <h1>Gallery</h1>
      <div className='search-wrapper'>
        <div className='search'>
          <img className='search-img' src='https://cdn-icons-png.freepik.com/512/9135/9135995.png' alt='search-img' />
          <input type='text' className='search-input' placeholder='Search here...' />
        </div>
        <div className='clear-btn'>x</div>
      </div>
    </div>
  );
};
