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
  const navigate = useNavigate();

  const { data, isLoading } = useInfinitePhotos(searchQuery);
  const images = data?.pages.flatMap((el) => el.images) ?? [];

  const [searchParams] = useSearchParams();
  const searchedId = searchParams.get('id');
  const currentImageIndex = images.findIndex((el) => el.id === searchedId) ?? 0;

  const [scrollPosition, setScrollPosition] = useState(currentImageIndex * SCROLL_STEP);

  const prevDisabled = scrollPosition === 0;
  const nextDisabled = scrollPosition === (images.length - 1) * SCROLL_STEP;

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

  const handlePrevClick = () => {
    setScrollPosition((prevPosition) => prevPosition - SCROLL_STEP);
  };

  const handleNextClick = () => {
    setScrollPosition((prevPosition) => prevPosition + SCROLL_STEP);
  };

  return (
    <>
      {isLoading && <Loader />}

      <div className='carousel-wrapper'>
        <div className='carousel' {...handlers} style={{ transform: `translateX(-${scrollPosition}%)` }}>
          {images?.map((image, index) => (
            <CarouselCard
              imageId={image.id}
              imageUrl={image.urls.regular}
              key={`image-card-${image.created_at}-${index}`}
            />
          ))}
        </div>

        <div className='container-btn'>
          <div
            className={`btn ${prevDisabled && 'disabled-btn'}`}
            onClick={prevDisabled ? () => {} : () => handlePrevClick()}
          >
            Prev
          </div>
          <div
            className={`btn ${nextDisabled && 'disabled-btn'}`}
            onClick={nextDisabled ? () => {} : () => handleNextClick()}
          >
            Next
          </div>
        </div>

        <div className='close-carousel-btn' onClick={() => navigate('/images')}>
          x
        </div>
      </div>
    </>
  );
};
