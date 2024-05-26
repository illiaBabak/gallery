import { createContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Carousel } from 'src/components/Carousel';
import { ErrorPage } from 'src/components/ErrorPage';
import { Header } from 'src/components/Header';
import { ImagesList } from 'src/components/ImagesList';

type GlobalContextType = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

export const GlobalContext = createContext<GlobalContextType>({
  searchQuery: '',
  setSearchQuery: () => {
    throw new Error('Global context is not initialized');
  },
});

export const App = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <GlobalContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
      }}
    >
      <div className='container'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navigate to='/images' />} />
            <Route path='/*' element={<Navigate to='/error' />} />
            <Route
              path='/images'
              element={
                <>
                  <Header />
                  <ImagesList />
                </>
              }
            />
            <Route path='/carousel' element={<Carousel />} />
            <Route path='/error' element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </GlobalContext.Provider>
  );
};
