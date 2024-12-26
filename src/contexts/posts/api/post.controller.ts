import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import { Controller, Get, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { SupabaseAuthGuard } from "@/src/app/auth/guards/supabase-auth-guard";

import { BaseController } from "@/contexts/base/api/base.controller";

import { Post as PostModel } from "./post.model";
import { PostService } from "./post.service";

@Controller("posts")
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth("access-token")
export class PostController extends BaseController<PostModel> {
  constructor(protected readonly service: PostService) {
    super(service);
  }

  // You can still add extra endpoints here if needed

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get("highlights")
  async getHighlights() {
    return this.service.getHighlights();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get("mainHighlights")
  getMainHighlights() {
    return this.service.getMainHighlights();
  }

  // etc...
}
