import { useContext } from 'react';
import { GlobalContext } from 'src/root';
import { ImageType } from 'src/types/types';
import { capitalize } from 'src/utils/capitalize';
import { parseDate } from 'src/utils/parseDate';

export const ImageCard = ({ image }: { image: ImageType }): JSX.Element => {
  const { setShouldShowCarousel } = useContext(GlobalContext);

  return (
    <div className='image-card' onClick={() => setShouldShowCarousel(true)}>
      <h3 className='image-title'>{capitalize(image.alt_description)}</h3>
      <img className='image-icon' src={image.urls.regular} alt={image.alt_description} />
      <p className='created-text'>Created at: {parseDate(image.created_at)}</p>
      <p className='likes-text'>Likes: {image.likes}</p>
      <div className='image-user-info'>
        <img className='user-icon' src={image.user.profile_image.medium} alt='user-icon' />
        <p className='username'>{image.user.username}</p>
      </div>
    </div>
  );
};
