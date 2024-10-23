import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { SupabaseAuthStrategy, SupabaseAuthUser } from "nestjs-supabase-auth";
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkIfUserIsValid(res: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!res || res?.user === null) {
      throw new UnauthorizedException();
    }
  }

  async validate(payload: SupabaseAuthUser): Promise<SupabaseAuthUser> {
    const res = await super.validate(payload);
    this.checkIfUserIsValid(res);

    return res;
  }
}
