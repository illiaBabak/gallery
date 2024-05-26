import { useNavigate } from 'react-router-dom';

export const ErrorPage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className='error-page'>
      <div className='content-wrapper'>
        <div className='info-content'>
          <h1>Page does not found</h1>
          <img className='error-icon' src='https://cdn-icons-png.freepik.com/512/4421/4421312.png' alt='error-icon' />
        </div>

        <div className='redirect-btn' onClick={() => navigate('/images')}>
          Return
        </div>
      </div>
    </div>
  );
};
