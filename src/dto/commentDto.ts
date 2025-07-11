export interface CommentDto {
  id: string;
  postId: string;
  text: string;
  author: { userId: string; username: string; imageUrl?: string };
}
