export interface CreatePostBody {
  caption?: string;
  media: {
    type: "image" | "video";
    url: string;
  }[];
  location?: string;
  tags?: string[];
}

export interface UpdatePostBody {
  caption?: string;
  location?: string;
  tags?: string[];
}

export interface PostQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

