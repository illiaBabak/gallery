import { useInfinitePhotos } from 'src/api/photos';
import { CarouselCard } from '../CarouselCard';
import { useState } from 'react';
import { Loader } from '../Loader';
import { useSwipeable } from 'react-swipeable';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SCROLL_STEP = 100;

const SWIPE_OPTIONS = {
  delta: 10,
  preventScrollOnSwipe: false,
  trackTouch: true,
  trackMouse: true,
  rotationAngle: 0,
  swipeDuration: Infinity,
  touchEventOptions: { passive: true },
};

export const Carousel = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [draggedNoteKey, setDraggedNoteKey] = useState('');
  const navigate = useNavigate();

  const searchedImages = searchParams.get('query') ?? '';
  const searchedId = searchParams.get('id');

  const { data, isLoading } = useInfinitePhotos(searchedImages);
  const images = data?.pages.flatMap((el) => el.images) ?? [];

  const currentImageIndex = images.findIndex((el) => el.id === searchedId);

  const scrollPos = currentImageIndex * SCROLL_STEP;

  const isPrevDisabled = currentImageIndex === 0;
  const isNextDisabled = currentImageIndex === images.length - 1;

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (isNextDisabled) return;

      handleNextClick();
    },
    onSwipedRight: () => {
      if (isPrevDisabled) return;

      handlePrevClick();
    },
    ...SWIPE_OPTIONS,
  });

  const handlePrevClick = () => {
    if (searchedImages) {
      setSearchParams({ id: images[currentImageIndex - 1].id, query: searchedImages });
      return;
    }

    setSearchParams({ id: images[currentImageIndex - 1].id });
  };

  const handleNextClick = () => {
    if (searchedImages) {
      setSearchParams({ id: images[currentImageIndex + 1].id, query: searchedImages });
      return;
    }

    setSearchParams({ id: images[currentImageIndex + 1].id });
  };

  return (
    <>
      {isLoading && <Loader />}

      <div
        className={`carousel-wrapper ${draggedNoteKey ? 'dragged-wrapper' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => setDraggedNoteKey('')}
      >
        <div className='carousel' {...handlers} style={{ transform: `translateX(-${scrollPos}%)` }}>
          {images?.map((image, index) => (
            <CarouselCard
              imageId={image.id}
              imageUrl={image.urls.regular}
              key={`image-card-${image.created_at}-${index}`}
              draggedNoteKey={draggedNoteKey}
              setDraggedNoteKey={setDraggedNoteKey}
            />
          ))}
        </div>

        <div className='container-btn'>
          <div className={`nav-btn-wrapper ${isPrevDisabled ? 'disabled-btn' : ''}`}>
            <div className='btn' onClick={handlePrevClick}>
              Prev
            </div>
          </div>

          <div className={`nav-btn-wrapper ${isNextDisabled ? 'disabled-btn' : ''}`}>
            <div className='btn' onClick={handleNextClick}>
              Next
            </div>
          </div>
        </div>

        <div className='close-carousel-btn' onClick={() => navigate('/images')}>
          x
        </div>
      </div>
    </>
  );
};
