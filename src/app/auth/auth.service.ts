/* eslint-disable unicorn/no-null */
import { Injectable } from "@nestjs/common";
import axios, { AxiosResponse } from "axios";

import { SupabaseProvider } from "@/src/contexts/shared/supabase/supabase.provider";

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

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

  async signInWithGoogle() {
    const { data, error } = await this.supabaseProvider
      .getClient()
      .auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: process.env.GOOGLE_OAUTH_CALLBACK,
        },
      });

    return {
      data,
      error,
    };
  }

  async verifyGoogleAccessToken(providerToken: string) {
    try {
      const response: AxiosResponse<GoogleUserInfo> = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${providerToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to verify Google token: ${error instanceof Error ? error.message : ""}`,
      );
    }
  }
}
