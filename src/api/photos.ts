import { UseInfiniteQueryResult, useInfiniteQuery } from '@tanstack/react-query';
import { ImageType } from 'src/types/types';
import { isImageArr, isImageSearchArr } from 'src/utils/guards';

type ResponseType = {
  images: ImageType[];
};

const API_URL = 'https://api.unsplash.com/photos';
const API_URL_WITH_SEARCH = 'https://api.unsplash.com/search/photos';

const getPhotos = async (
  pageNumber: number,
  query: string
): Promise<(ResponseType & { pageNumber: number }) | undefined> => {
  try {
    const response = await fetch(
      `${query ? API_URL_WITH_SEARCH : API_URL}?page=${pageNumber}${query ? `&query=${query}` : ''}&client_id=${import.meta.env.VITE_API_KEY}`
    );
    const responseData: unknown = await response.json();

    if (query && isImageSearchArr(responseData)) return { images: responseData.results, pageNumber };

    return { images: isImageArr(responseData) ? responseData : [], pageNumber };
  } catch {
    throw new Error('Something went wrong with request (photos)');
  }
};

export const useInfinitePhotos = (
  query: string
): UseInfiniteQueryResult<{ pages: ResponseType[] } | undefined, Error> => {
  return useInfiniteQuery({
    queryKey: ['photos', query],
    queryFn: async ({ pageParam }) => {
      return await getPhotos(pageParam, query);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage) return lastPage?.pageNumber + 1 ?? 1;
    },
  });
};
