import { useInfinitePhotos } from 'src/api/photos';
import { CarouselCard } from '../CarouselCard';
import { useContext, useState } from 'react';
import { GlobalContext } from 'src/root';
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
  const { searchQuery } = useContext(GlobalContext);
  const [draggedNoteKey, setDraggedNoteKey] = useState('');
  const navigate = useNavigate();

  const { data, isLoading } = useInfinitePhotos(searchQuery);
  const images = data?.pages.flatMap((el) => el.images) ?? [];

  const [searchParams, setSearchParams] = useSearchParams();
  const searchedId = searchParams.get('id');
  const currentImageIndex = images.findIndex((el) => el.id === searchedId);

  const scrollPos = currentImageIndex * SCROLL_STEP;

  const prevDisabled = scrollPos === 0;
  const nextDisabled = scrollPos === (images.length - 1) * SCROLL_STEP;

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (nextDisabled) return;

      handleNextClick();
    },
    onSwipedRight: () => {
      if (prevDisabled) return;

      handlePrevClick();
    },
    ...SWIPE_OPTIONS,
  });

  const handlePrevClick = () => setSearchParams({ id: images[currentImageIndex - 1].id });

  const handleNextClick = () => setSearchParams({ id: images[currentImageIndex + 1].id });

  return (
    <>
      {isLoading && <Loader />}

      <div className={`carousel-wrapper ${draggedNoteKey ? 'dragged-wrapper' : ''}`}>
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
          <div className={`nav-btn-wrapper ${prevDisabled ? 'disabled-btn' : ''}`}>
            <div className='btn' onClick={handlePrevClick}>
              Prev
            </div>
          </div>

          <div className={`nav-btn-wrapper ${nextDisabled ? 'disabled-btn' : ''}`}>
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
