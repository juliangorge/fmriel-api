import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { SupabaseModule } from "@/src/contexts/shared/supabase/supabase.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SupabaseStrategy } from "./strategies/supabase.strategy";

@Module({
  imports: [SupabaseModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, SupabaseStrategy],
  exports: [AuthService, SupabaseStrategy],
})
export class AuthModule {}
