import { useInfinitePhotos } from 'src/api/photos';
import { ImageCard } from '../ImageCard';
import { useRef } from 'react';
import { Loader } from '../Loader';

const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: '0px',
  threshold: 1,
};

export const ImagesList = (): JSX.Element => {
  const observer = useRef<IntersectionObserver | null>(null);
  const { data, isFetchingNextPage, fetchNextPage } = useInfinitePhotos();
  const images = data?.pages.flatMap((el) => el.images) ?? [];

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

      {isFetchingNextPage ? <Loader /> : <div ref={handleIntersect} />}
    </>
  );
};
