import { Injectable } from "@nestjs/common";

import { BaseService } from "@/src/contexts/base/api/base.service";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { Post } from "./post.model";
import { PostRepository } from "./post.repository";

@Injectable()
export class PostService extends BaseService<Post> {
  constructor(
    protected readonly supabaseProvider: SupabaseProvider,
    protected readonly postRepository: PostRepository,
  ) {
    super(supabaseProvider, postRepository);
  }

  async getHighlights(): Promise<Post[]> {
    return await this.postRepository.getHighlights();
  }

  async getMainHighlights(): Promise<Post[]> {
    return await this.postRepository.getMainHighlights();
  }
}
