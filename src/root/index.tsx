import { Header } from 'src/components/Header';
import { ImagesList } from 'src/components/ImagesList';

export const App = (): JSX.Element => {
  return (
    <div className='container'>
      <Header />
      <ImagesList />
    </div>
  );
};
