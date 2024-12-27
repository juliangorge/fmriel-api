/* eslint-disable unicorn/no-null */
import { UnauthorizedException } from "@nestjs/common";
import { SupabaseAuthStrategy, SupabaseAuthUser } from "nestjs-supabase-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SupabaseStrategy } from "@/src/app/auth/strategies/supabase.strategy";

// A minimal shape of the payload, if you need more properties, add them
const validPayload: SupabaseAuthUser = {
  user: { id: "user-123" },
} as unknown as SupabaseAuthUser;

describe("SupabaseStrategy", () => {
  let strategy: SupabaseStrategy;

  beforeEach(() => {
    // Create a fresh instance of your strategy
    strategy = new SupabaseStrategy();
    // Clear any mocks/spies before each test
    vi.clearAllMocks();
  });

  describe("validate", () => {
    it("should throw UnauthorizedException if super.validate returns null or a null user", async () => {
      // 1. Spy on the parent class (SupabaseAuthStrategy) validate method
      //    and force it to resolve with an invalid user object
      const superValidateSpy = vi
        .spyOn(SupabaseAuthStrategy.prototype, "validate")
        .mockResolvedValue(undefined as unknown as SupabaseAuthUser);

      // 2. Attempt to validate
      await expect(strategy.validate(validPayload)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(superValidateSpy).toHaveBeenCalledOnce();
    });

    it("should throw UnauthorizedException if super.validate returns undefined or is empty", async () => {
      // Force it to resolve with undefined
      const superValidateSpy = vi
        .spyOn(SupabaseAuthStrategy.prototype, "validate")
        .mockResolvedValue(undefined as unknown as SupabaseAuthUser);

      await expect(strategy.validate(validPayload)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(superValidateSpy).toHaveBeenCalledOnce();
    });

    it("should return the valid user if super.validate returns a valid object", async () => {
      const validUser: SupabaseAuthUser = {
        user: { id: "valid-user-id" },
      } as unknown as SupabaseAuthUser;

      // Mock the parent validate to return a valid user
      const superValidateSpy = vi
        .spyOn(SupabaseAuthStrategy.prototype, "validate")
        .mockResolvedValue(validUser);

      // Call strategy.validate
      const result = await strategy.validate(validPayload);
      expect(result).toEqual(validUser);
      expect(superValidateSpy).toHaveBeenCalledOnce();
    });
  });

  describe("checkIfUserIsValid", () => {
    it("should throw UnauthorizedException if res is null", () => {
      expect(() => strategy.checkIfUserIsValid(null)).toThrow(
        UnauthorizedException,
      );
    });

    it("should throw UnauthorizedException if res.user is null", () => {
      expect(() => strategy.checkIfUserIsValid({ user: null })).toThrow(
        UnauthorizedException,
      );
    });

    it("should not throw if res.user is valid", () => {
      expect(() =>
        strategy.checkIfUserIsValid({ user: { id: "123" } }),
      ).not.toThrow();
    });
  });
});
