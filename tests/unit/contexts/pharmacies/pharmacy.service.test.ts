/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PharmacyMock } from "@/tests/utils/mocks/pharmacy";

import { PharmacyRepository } from "@/src/contexts/pharmacies/api/pharmacy.repository";
import { PharmacyService } from "@/src/contexts/pharmacies/api/pharmacy.service";
import { SupabaseProvider } from "@/src/contexts/shared/supabase/supabase.provider";

describe("PharmacyService", () => {
  let service: PharmacyService;
  let repositoryMock: PharmacyRepository;
  let supabaseProviderMock: SupabaseProvider;

  // You only need to mock the methods that PharmacyService (or BaseService) actually calls
  const mockPharmacyRepository = {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const mockSupabaseProvider = {
    getClient: vi.fn().mockReturnValue({
      from: vi.fn(),
      auth: {
        getSession: vi.fn().mockResolvedValue({
          session: { user: { id: "test-user-id" } },
        }),
      },
    }),
  };

  beforeEach(() => {
    repositoryMock = mockPharmacyRepository as unknown as PharmacyRepository;
    supabaseProviderMock = mockSupabaseProvider as unknown as SupabaseProvider;

    // Instantiate the PharmacyService with the mocked repository and provider
    service = new PharmacyService(supabaseProviderMock, repositoryMock);

    // Clear calls so each test is isolated
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  //
  // If you want integration-style checks for inherited methods, keep these:
  // (Otherwise, remove them to avoid duplicating the coverage from base.service.test.ts)
  //
  describe("Inherited BaseService methods", () => {
    it("should call repository.getAll and return all posts", async () => {
      const mockData = [PharmacyMock];
      mockPharmacyRepository.getAll.mockResolvedValueOnce(mockData);

      const result = await service.getAll();
      expect(result).toBe(mockData);
      expect(repositoryMock.getAll).toHaveBeenCalledOnce();
    });

    it("should call repository.getById and return a post", async () => {
      const id = 1;
      const mockData = { ...PharmacyMock, id };
      mockPharmacyRepository.getById.mockResolvedValueOnce(mockData);

      const result = await service.getById(id);
      expect(result).toBe(mockData);
      expect(repositoryMock.getById).toHaveBeenCalledWith(id);
    });

    // Similarly, you could add tests for create, update, and delete
    // if you'd like an extra layer of integration checks.
    // ...
  });
});
