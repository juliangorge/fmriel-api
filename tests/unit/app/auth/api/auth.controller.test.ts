import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthController } from "@/app/auth/auth.controller";
import { AuthService } from "@/app/auth/auth.service";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  // Mock for AuthService
  const mockAuthService = {
    signInUser: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it("should call authService.signInUser and return the token", async () => {
    const mockToken = { accessToken: "mocked_token" };
    const mockDto = { email: "test@example.com", password: "password123" };

    // Mock the signInUser method to return the mockToken
    mockAuthService.signInUser.mockResolvedValueOnce(mockToken);

    const result = await authController.signIn(mockDto);

    // Check if the authService.signInUser was called with the correct dto
    expect(authService.signInUser).toHaveBeenCalledWith(mockDto);

    // Assert that the result returned from the controller is correct
    expect(result).toEqual(mockToken);
  });

  it("should handle errors from the authService", async () => {
    const mockDto = { email: "test@example.com", password: "password123" };
    const mockError = new Error("Invalid credentials");

    // Mock the signInUser method to throw an error
    mockAuthService.signInUser.mockRejectedValueOnce(mockError);

    try {
      await authController.signIn(mockDto);
    } catch (error) {
      // Expect the error to be the one that was mocked
      expect(error).toBe(mockError);
    }

    // Check if the authService.signInUser was called with the correct dto
    expect(authService.signInUser).toHaveBeenCalledWith(mockDto);
  });
});
