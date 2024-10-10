import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { SupabaseAuthGuard } from "@/src/app/auth/guards/supabase-auth-guard";

import { PostSectionService } from "./post-section.service";

@Controller("postSections")
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth("access-token")
export class PostSectionController {
  constructor(private readonly postSectionService: PostSectionService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600 * 24) // 24 hours
  @Get()
  getAll() {
    return this.postSectionService.getAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600 * 24) // 24 hours
  @Get(":id")
  getById(@Param("id") id: string) {
    const postSectionId = Number.parseInt(id, 10);
    return this.postSectionService.getById(postSectionId);
  }
}
