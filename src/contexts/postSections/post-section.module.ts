import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";

import { SupabaseModule } from "@/shared/supabase/supabase.module";

import { PostSectionController } from "./api/post-section.controller";
import { PostSectionRepository } from "./api/post-section.repository";
import { PostSectionService } from "./api/post-section.service";

@Module({
  imports: [SupabaseModule, CacheModule.register({ isGlobal: true })],
  controllers: [PostSectionController],
  providers: [PostSectionService, PostSectionRepository],
})
export class PostSectionModule {}
