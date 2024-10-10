import { Injectable } from "@nestjs/common";

import { BaseRepository } from "@/contexts/base/api/base.repository";

import { Post } from "./post.model";

@Injectable()
export class PostRepository extends BaseRepository<Post> {
  constructor() {
    super("posts");
  }

  async findById(id: number): Promise<Post> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*, post_sections(name)")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`Error fetching data: ${error.message}`);
    return data as Post;
  }

  async findFeatured(): Promise<Post[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*, post_sections(name)")
      .order("created_at", { ascending: false });
    if (error)
      throw new Error(`Error fetching featured posts: ${error.message}`);
    return data as Post[];
  }
}
