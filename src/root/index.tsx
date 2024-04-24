import { createContext, useState } from 'react';
import { Carousel } from 'src/components/Carousel';
import { Header } from 'src/components/Header';
import { ImagesList } from 'src/components/ImagesList';

type GlobalContextType = {
  shouldShowCarousel: boolean;
  setShouldShowCarousel: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

export const GlobalContext = createContext<GlobalContextType>({
  shouldShowCarousel: false,
  setShouldShowCarousel: () => {
    throw new Error('Global context is not initalized');
  },
  searchQuery: '',
  setSearchQuery: () => {
    throw new Error('Global context is not initialized');
  },
});

export const App = (): JSX.Element => {
  const [shouldShowCarousel, setShouldShowCarousel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <GlobalContext.Provider value={{ searchQuery, setSearchQuery, setShouldShowCarousel, shouldShowCarousel }}>
      <div className='container'>
        <Header />
        {shouldShowCarousel ? <Carousel /> : <ImagesList />}
      </div>
    </GlobalContext.Provider>
  );
};
