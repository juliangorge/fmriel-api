/* eslint-disable unicorn/no-null */
import {
  AuthTokenResponsePassword,
  SupabaseClient,
} from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, Mock, Mocked, vi } from "vitest";

import { AuthService } from "@/app/auth/auth.service";

// Mock the environment variables
vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
vi.stubEnv("SUPABASE_KEY", "some-key");

describe("AuthService", () => {
  let authService: AuthService;
  let supabaseMock: Mocked<SupabaseClient>;

  beforeEach(() => {
    // Mock the Supabase client and its auth.signInWithPassword function
    supabaseMock = {
      auth: {
        signInWithPassword: vi.fn(), // Override the method explicitly with vi.fn()
      },
    } as unknown as Mocked<SupabaseClient>;

    // Initialize the service with the mocked Supabase client
    authService = new AuthService();
    authService["supabaseClient"] = supabaseMock; // Inject the mock directly into the service
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

    // Mock the signInWithPassword function to return a successful response
    (supabaseMock.auth.signInWithPassword as Mock).mockResolvedValueOnce(
      mockResponse as AuthTokenResponsePassword,
    );

    const result = await authService.signInUser(mockDto);

    // Ensure the mock is called with the correct DTO
    expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith({
      email: mockDto.email,
      password: mockDto.password,
    });

    // Ensure the result matches the mock response
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

    // Mock the signInWithPassword function to return an error
    (supabaseMock.auth.signInWithPassword as Mock).mockResolvedValueOnce(
      mockResponse as AuthTokenResponsePassword,
    );

    const result = await authService.signInUser(mockDto);

    // Ensure the mock is called with the correct DTO
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
