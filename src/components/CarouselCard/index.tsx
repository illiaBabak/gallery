type Props = {
  imageUrl: string;
};

export const CarouselCard = ({ imageUrl }: Props): JSX.Element => (
  <div className='carousel-card'>
    <img className='carousel-img' src={imageUrl} alt='carousel-image' />
  </div>
);
