import { useInfinitePhotos } from 'src/api/photos';
import { CarouselCard } from '../CarouselCard';
import { useContext, useState } from 'react';
import { GlobalContext } from 'src/root';
import { Loader } from '../Loader';

const SCROLL_STEP = 100;

export const Carousel = (): JSX.Element => {
  const { searchQuery, setShouldShowCarousel } = useContext(GlobalContext);
  const { data, isLoading } = useInfinitePhotos(searchQuery);
  const images = data?.pages.flatMap((el) => el.images) ?? [];

  const [scrollPosition, setScrollPosition] = useState(0);

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
        <div className='carousel' style={{ transform: `translateX(-${scrollPosition}%)` }}>
          {images?.map((image, index) => (
            <CarouselCard imageUrl={image.urls.regular} key={`image-card-${image.created_at}-${index}`} />
          ))}
        </div>

        <div className='container-btn'>
          <div
            className={`btn ${scrollPosition === 0 ? 'disabled-btn' : ''}`}
            onClick={scrollPosition === 0 ? () => {} : () => handlePrevClick()}
          >
            Prev
          </div>
          <div
            className={`btn ${scrollPosition === (images.length - 1) * SCROLL_STEP ? 'disabled-btn' : ''}`}
            onClick={scrollPosition === (images.length - 1) * SCROLL_STEP ? () => {} : () => handleNextClick()}
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
