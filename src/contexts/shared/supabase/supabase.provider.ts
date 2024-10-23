import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable({ scope: Scope.REQUEST })
export class SupabaseProvider {
  private supabase: SupabaseClient;

  constructor(@Inject(REQUEST) protected readonly request: Request) {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_KEY!;

    const accessToken = this.getAccessTokenFromRequest();

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  private getAccessTokenFromRequest(): string | undefined {
    const headers = this.request.headers as unknown as {
      [key: string]: string | undefined;
    };
    const authHeader = headers["authorization"];

    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.slice(7);
    }

    return undefined;
  }
}
