/* eslint-disable unicorn/no-null */
import {
  AuthTokenResponsePassword,
  SupabaseClient,
} from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { SupabaseProvider } from "@/src/contexts/shared/supabase/supabase.provider";

import { AuthService } from "@/app/auth/auth.service";

// Mock the environment variables
vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
vi.stubEnv("SUPABASE_KEY", "some-key");

describe("AuthService", () => {
  let authService: AuthService;
  let supabaseMock: SupabaseClient;
  let supabaseProviderMock: SupabaseProvider;

  beforeEach(() => {
    // Mock the SupabaseClient and its auth.signInWithPassword function
    supabaseMock = {
      auth: {
        signInWithPassword: vi.fn(), // Mock signInWithPassword
      },
    } as unknown as SupabaseClient;

    // Mock SupabaseProvider to return the mocked SupabaseClient
    supabaseProviderMock = {
      getClient: vi.fn().mockReturnValue(supabaseMock),
    } as unknown as SupabaseProvider;

    // Initialize the AuthService with the mocked SupabaseProvider
    authService = new AuthService(supabaseProviderMock);
  });

  it("should sign in the user and return user data and session", async () => {
    const mockResponse = {
      data: {
        user: { id: "user-id", email: "test@example.com" },
        session: {
          access_token: "access-token",
          refresh_token: "refresh-token",
        },
      },
      error: null,
    };

    const mockDto = { email: "test@example.com", password: "password123" };

    // Mock the signInWithPassword method to return a successful response
    (supabaseMock.auth.signInWithPassword as Mock).mockResolvedValueOnce(
      mockResponse as AuthTokenResponsePassword,
    );

    const result = await authService.signInUser(mockDto);

    // Ensure the mock is called with the correct arguments
    expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith({
      email: mockDto.email,
      password: mockDto.password,
    });

    // Ensure the result matches the expected mock response
    expect(result).toEqual({
      user: mockResponse.data.user,
      session: mockResponse.data.session,
      error: null,
    });
  });

  it("should return an error if signInWithPassword fails", async () => {
    const mockError = { message: "Invalid credentials" };
    const mockResponse = {
      data: { user: null, session: null },
      error: mockError,
    };

    const mockDto = { email: "test@example.com", password: "wrong-password" };

    // Mock the signInWithPassword method to return an error
    (supabaseMock.auth.signInWithPassword as Mock).mockResolvedValueOnce(
      mockResponse as AuthTokenResponsePassword,
    );

    const result = await authService.signInUser(mockDto);

    // Ensure the mock is called with the correct arguments
    expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith({
      email: mockDto.email,
      password: mockDto.password,
    });

    // Ensure the result contains the error message
    expect(result).toEqual({
      user: null,
      session: null,
      error: mockError,
    });
  });
});
