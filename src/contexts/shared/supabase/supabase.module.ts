import { Module, Scope } from "@nestjs/common";

import { SupabaseProvider } from "./supabase.provider";

@Module({
  providers: [
    {
      provide: SupabaseProvider,
      useClass: SupabaseProvider,
      scope: Scope.REQUEST,
    },
  ],
  exports: [SupabaseProvider],
})
export class SupabaseModule {}
