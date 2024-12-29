import { Body, Controller, Get, Post, Query, Redirect } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { SignInDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
@ApiTags("authentication")
export class AuthController {
  constructor(protected readonly authService: AuthService) {}

  @Post("signIn")
  @ApiOperation({
    summary: "Acquires an access token",
    description: "This endpoint will provide an access token.",
  })
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signInUser(dto);
  }

  @Get("signInWithGoogle")
  @ApiOperation({
    summary: "Redirects to Google OAuth",
    description:
      "Initiates the Google OAuth flow and redirects to Google's login page.",
  })
  @Redirect()
  async signInWithGoogle() {
    const { data, error } = await this.authService.signInWithGoogle();
    if (error) {
      throw new Error(error.message);
    }

    return { url: data.url };
  }

  @Get("google-callback")
  @ApiOperation({
    summary: "Handles the Google OAuth callback",
    description: "Receives tokens from Supabase after Google authentication.",
  })
  async handleGoogleCallback(
    @Query("access_token") accessToken: string,
    @Query("refresh_token") refreshToken: string,
    @Query("expires_in") expiresIn: string,
    @Query("provider_token") providerToken: string,
    @Query("token_type") tokenType: string,
  ) {
    if (!accessToken) {
      throw new Error("Missing access token.");
    }

    const user = await this.authService.verifyGoogleAccessToken(providerToken);

    return {
      user,
      accessToken,
      refreshToken,
      tokenType,
      expiresIn,
    };
  }
}
