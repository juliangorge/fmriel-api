import { Injectable } from "@nestjs/common";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { BaseRepository } from "@/contexts/base/api/base.repository";

import { Post } from "./post.model";

@Injectable()
export class PostRepository extends BaseRepository<Post> {
  constructor(protected supabaseProvider: SupabaseProvider) {
    super(supabaseProvider, "posts");
  }

  async getById(id: number): Promise<Post> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*, post_categories(name)")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`Error fetching data: ${error.message}`);
    return data as Post;
  }

  async getHighlights(): Promise<Post[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*, post_categories(name)");
    //.order("created_at", { ascending: false });
    if (error) throw new Error(`Error fetching data: ${error.message}`);
    return data as Post[];
  }

  async getMainHighlights(): Promise<Post[]> {
    const { data, error } = await this.supabase
      .from("highlight_posts")
      .select("posts(*, post_categories(name))");

    if (error) throw new Error(`Error fetching data: ${error.message}`);

    return (data as unknown as { posts: Post }[]).map(item => item.posts);
  }
}
