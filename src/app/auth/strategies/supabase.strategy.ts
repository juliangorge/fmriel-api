/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@supabase/supabase-js";
import { SupabaseAuthStrategy } from "nestjs-supabase-auth";
import { ExtractJwt } from "passport-jwt";

@Injectable()
export class SupabaseStrategy extends PassportStrategy(
  SupabaseAuthStrategy,
  "supabase",
) {
  public constructor() {
    super({
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      supabaseOptions: {},
      supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET,
      extractor: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: User): Promise<any> {
    // console.log("in validate");
    const res = super.validate(payload);
    return res;
  }

  authenticate(req: any) {
    // console.log("in authenticate");
    const res = super.authenticate(req);
    return res;
  }
}
