import { useState } from 'react';
import { Header } from 'src/components/Header';
import { ImagesList } from 'src/components/ImagesList';

export const App = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className='container'>
      <Header setSearchQuery={setSearchQuery} />
      <ImagesList searchQuery={searchQuery} />
    </div>
  );
};
