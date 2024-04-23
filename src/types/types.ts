export type ImageType = {
  alt_description: string;
  created_at: string;
  likes: number;
  urls: ImageUrl;
  user: ImageUser;
};

export type ImageUrl = {
  regular: string;
};

export type ImageUser = {
  username: string;
  profile_image: {
    medium: string;
  };
};
