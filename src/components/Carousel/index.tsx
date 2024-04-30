import { useInfinitePhotos } from 'src/api/photos';
import { CarouselCard } from '../CarouselCard';
import { useContext, useState } from 'react';
import { GlobalContext } from 'src/root';
import { Loader } from '../Loader';
import { useSwipeable } from 'react-swipeable';

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
  const { searchQuery, setShouldShowCarousel, lastClickedElIndex } = useContext(GlobalContext);
  const { data, isLoading } = useInfinitePhotos(searchQuery);
  const [scrollPosition, setScrollPosition] = useState(lastClickedElIndex * SCROLL_STEP);
  const images = data?.pages.flatMap((el) => el.images) ?? [];

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

        <div className='close-carousel-btn' onClick={() => setShouldShowCarousel(false)}>
          x
        </div>
      </div>
    </>
  );
};
