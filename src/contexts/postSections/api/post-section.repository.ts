import { Injectable } from "@nestjs/common";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { BaseRepository } from "@/contexts/base/api/base.repository";

import { PostSection } from "./post-section.model";

@Injectable()
export class PostSectionRepository extends BaseRepository<PostSection> {
  constructor(protected supabaseProvider: SupabaseProvider) {
    super(supabaseProvider, "post_categories");
  }
}
