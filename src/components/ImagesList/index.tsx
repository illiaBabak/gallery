import { useInfinitePhotos } from 'src/api/photos';
import { ImageCard } from '../ImageCard';

export const ImagesList = (): JSX.Element => {
  const { data } = useInfinitePhotos();
  const images = data?.pages[0].images;

  return (
    <div className='images-list'>
      {images?.map((image, index) => <ImageCard image={image} key={`image-card-${image.created_at}-${index}`} />)}
    </div>
  );
};
