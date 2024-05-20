import { useInfinitePhotos } from 'src/api/photos';
import { ImageCard } from '../ImageCard';
import { useContext, useRef } from 'react';
import { Loader } from '../Loader';
import { GlobalContext } from 'src/root';

const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: '0px',
  threshold: 1,
};

export const ImagesList = (): JSX.Element => {
  const { searchQuery } = useContext(GlobalContext);
  const observer = useRef<IntersectionObserver | null>(null);
  const { data, isFetchingNextPage, fetchNextPage, isLoading } = useInfinitePhotos(searchQuery);
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
      <div className='images-list'>
        {images?.map((image, index) => <ImageCard image={image} key={`image-card-${image.created_at}-${index}`} />)}
      </div>

      {isFetchingNextPage || isLoading ? <Loader /> : <div ref={handleIntersect} />}
    </>
  );
};
