import { Injectable } from "@nestjs/common";

import { BaseService } from "@/src/contexts/base/api/base.service";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { PostSection } from "./post-section.model";
import { PostSectionRepository } from "./post-section.repository";

@Injectable()
export class PostSectionService extends BaseService<PostSection> {
  constructor(
    protected readonly supabaseProvider: SupabaseProvider,
    private readonly postSectionRepository: PostSectionRepository,
  ) {
    super(supabaseProvider, postSectionRepository);
  }
}
