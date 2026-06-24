export interface PressReviewRequest {
  chat_id: number;
  subject: string;
}

export interface ArticleSynthesis {
  title: string;
  summary: string;
}

export interface PressReview {
  title: string;
  subject: string;
  general_summary: string;
  articles: ArticleSynthesis[];
  created_at: string;
}

export type PressReviewResponse = PressReview;
