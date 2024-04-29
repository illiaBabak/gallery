import PrismaZoom from 'react-prismazoom';

type Props = {
  imageUrl: string;
};

export const CarouselCard = ({ imageUrl }: Props): JSX.Element => {
  return (
    <div className='carousel-card'>
      <div className='img-wrapper'>
        <PrismaZoom scrollVelocity={0.3} minZoom={1} maxZoom={2.5} doubleTouchMaxDelay={700}>
          <img className='carousel-img' src={imageUrl} alt='carousel-image' />
        </PrismaZoom>
      </div>
    </div>
  );
};
