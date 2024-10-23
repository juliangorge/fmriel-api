import { Injectable } from "@nestjs/common";

import { SupabaseProvider } from "@/src/contexts/shared/supabase/supabase.provider";

@Injectable()
export class AuthService {
  constructor(protected readonly supabaseProvider: SupabaseProvider) {}

  async signInUser(dto: { email: string; password: string }) {
    const { data, error } = await this.supabaseProvider
      .getClient()
      .auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    return {
      user: data.user,
      session: data.session,
      error: error,
    };
  }
}
