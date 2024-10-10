import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { SupabaseAuthGuard } from "@/src/app/auth/guards/supabase-auth-guard";

import { PostService } from "./post.service";

@Controller("posts")
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth("access-token")
export class PostController {
  constructor(private readonly service: PostService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600) // 1 hour
  @Get(":id")
  async getById(@Param("id") id: string) {
    const postId = Number.parseInt(id, 10);
    const post = await this.service.getById(postId);
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600) // 1 hour
  @Get("mainFeatured")
  getMainFeatured() {
    return this.service.getMainFeatured();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600) // 1 hour
  @Get("featured")
  getFeatured() {
    return this.service.getFeatured();
  }
}
