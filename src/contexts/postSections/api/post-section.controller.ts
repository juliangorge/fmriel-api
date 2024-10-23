import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { PostSectionService } from "./post-section.service";

@Controller("postSections")
@ApiTags("Post Sections")
@ApiBearerAuth("access-token")
export class PostSectionController {
  constructor(protected readonly postSectionService: PostSectionService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600 * 24) // 24 hours
  @Get()
  @ApiOperation({ summary: "Get all post sections" })
  getAll() {
    return this.postSectionService.getAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600 * 24) // 24 hours
  @Get(":id")
  @ApiOperation({ summary: "Get post section by ID" })
  getById(@Param("id") id: string) {
    const postSectionId = Number.parseInt(id, 10);
    return this.postSectionService.getById(postSectionId);
  }
}
