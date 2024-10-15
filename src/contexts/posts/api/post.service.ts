import { Injectable } from "@nestjs/common";

import { BaseService } from "@/src/contexts/base/api/base.service";

import { Post } from "./post.model";
import { PostRepository } from "./post.repository";

@Injectable()
export class PostService extends BaseService<Post> {
  constructor(protected readonly postRepository: PostRepository) {
    super(postRepository);
  }

  async getHighlights(): Promise<Post[]> {
    return await this.postRepository.findHighlights();
  }

  async getMainFeatured(): Promise<Post[]> {
    return await this.postRepository.findAll();
  }
}
