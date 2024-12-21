export interface Post {
  id: number;
  title: string;
  section_id: number;
  subtitle?: string;
  summary: string;
  body: string;
  tags: string;
  image?: string;
  epigraph?: string;
  created_at?: Date;
  last_modified_at?: Date;
  user_id: number;
}
