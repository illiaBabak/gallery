import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Carousel } from 'src/components/Carousel';
import { ErrorPage } from 'src/components/ErrorPage';
import { Header } from 'src/components/Header';
import { ImagesList } from 'src/components/ImagesList';

export const App = (): JSX.Element => (
  <div className='container'>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/images' />} />
        <Route path='/*' element={<Navigate to='/error' />} />
        <Route
          path='/images'
          index
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
);
