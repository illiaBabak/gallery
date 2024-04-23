import { UseInfiniteQueryResult, useInfiniteQuery } from '@tanstack/react-query';
import { ImageType } from 'src/types/types';
import { isImageArr } from 'src/utils/guards';

type ResponseType = {
  images: ImageType[];
};

const getPhotos = async (pageNumber: number): Promise<(ResponseType & { pageNumber: number }) | undefined> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}?page=${pageNumber}&client_id=${import.meta.env.VITE_API_KEY}`
    );
    const responseData: unknown = await response.json();

    if (isImageArr(responseData)) return { images: responseData, pageNumber };
  } catch {
    throw new Error('Something went wrong with request (photos)');
  }
};

export const useInfinitePhotos = (): UseInfiniteQueryResult<{ pages: ResponseType[] } | undefined, Error> => {
  return useInfiniteQuery({
    queryKey: ['photos'],
    queryFn: async ({ pageParam }) => {
      return await getPhotos(pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage) return lastPage?.pageNumber + 1 ?? 1;
    },
  });
};
