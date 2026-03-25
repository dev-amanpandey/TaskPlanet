export type Like = { userId: string; username: string };
export type Comment = { _id: string; userId: string; username: string; text: string; createdAt: string };

export type Post = {
  _id: string;
  userId: string;
  username: string;
  text?: string;
  imageDataUrl?: string;
  likesCount: number;
  commentsCount: number;
  likes: Like[];
  comments: Comment[];
  createdAt: string;
};

export type FeedResponse = {
  items: Post[];
  nextCursor: null | { cursorCreatedAt: string; cursorId: string };
};

