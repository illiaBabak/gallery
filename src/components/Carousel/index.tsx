import { useInfinitePhotos } from 'src/api/photos';
import { CarouselCard } from '../CarouselCard';
import { useState } from 'react';
import { Loader } from '../Loader';
import { useSwipeable } from 'react-swipeable';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SavedAlert } from '../SavedAlert';

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
  const [shouldShowSavedIcon, setShouldShowSavedIcon] = useState(false);
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

      handleClick(currentImageIndex + 1);
    },
    onSwipedRight: () => {
      if (isPrevDisabled) return;

      handleClick(currentImageIndex - 1);
    },
    ...SWIPE_OPTIONS,
  });

  const handleClick = (index: number) => {
    const imageId = images[index].id;

    setSearchParams((prev) => {
      prev.set('id', imageId);
      return prev;
    });
  };

  return (
    <>
      {isLoading && <Loader />}
      {shouldShowSavedIcon && <SavedAlert setShouldShowSavedIcon={setShouldShowSavedIcon} />}

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
              setShouldShowSavedIcon={setShouldShowSavedIcon}
            />
          ))}
        </div>

        <div className='container-btn'>
          <div className={`nav-btn-wrapper ${isPrevDisabled ? 'disabled-btn' : ''}`}>
            <div className='btn' onClick={() => handleClick(currentImageIndex - 1)}>
              Prev
            </div>
          </div>

          <div className={`nav-btn-wrapper ${isNextDisabled ? 'disabled-btn' : ''}`}>
            <div className='btn' onClick={() => handleClick(currentImageIndex + 1)}>
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
