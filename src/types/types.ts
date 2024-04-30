export type ImageType = {
  id: string;
  alt_description: string | null;
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

export type SearchImages = {
  results: ImageType[];
};

export type Note = { x: number; y: number; text: string };

export type StorageNotes = {
  id: string;
  notes: Note[];
};
