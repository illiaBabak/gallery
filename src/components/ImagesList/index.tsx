import { useInfinitePhotos } from 'src/api/photos';
import { ImageCard } from '../ImageCard';
import { useRef } from 'react';
import { Loader } from '../Loader';
import { useSearchParams } from 'react-router-dom';

const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: '0px',
  threshold: 1,
};

export const ImagesList = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const observer = useRef<IntersectionObserver | null>(null);
  const { data, isFetchingNextPage, fetchNextPage, isLoading } = useInfinitePhotos(searchParams.get('query') ?? '');
  const images = data?.pages.flatMap((el) => el.images);

  const handleIntersect = (el: HTMLElement | null) => {
    observer.current = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;

      if (images?.length && !isFetchingNextPage) fetchNextPage();
    }, OBSERVER_OPTIONS);

    if (el) observer.current.observe(el);
  };

  return (
    <>
      {images?.length || isLoading ? (
        <div className='images-list'>
          {images?.map((image, index) => <ImageCard image={image} key={`image-card-${image.created_at}-${index}`} />)}
        </div>
      ) : (
        <div className='empty-list'>
          <img
            className='empty-icon'
            src='https://t4.ftcdn.net/jpg/02/84/64/51/360_F_284645131_hE2W3bbPxFBkk2aNqNyiTgLiraaiAuDh.jpg'
            alt='Image not found'
          />
        </div>
      )}

      {isFetchingNextPage || isLoading ? <Loader /> : <div ref={handleIntersect} />}
    </>
  );
};
