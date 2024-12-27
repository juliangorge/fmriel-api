/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PharmacyScheduleMock } from "@/tests/utils/mocks/pharmacy-schedule";

import { PharmacyScheduleRepository } from "@/src/contexts/pharmacySchedules/api/pharmacy-schedule.repository";
import { PharmacyScheduleService } from "@/src/contexts/pharmacySchedules/api/pharmacy-schedule.service";
import { SupabaseProvider } from "@/src/contexts/shared/supabase/supabase.provider";

describe("PharmacyScheduleService", () => {
  let service: PharmacyScheduleService;
  let repositoryMock: PharmacyScheduleRepository;
  let supabaseProviderMock: SupabaseProvider;

  // You only need to mock the methods that PharmacyScheduleService (or BaseService) actually calls
  const mockPharmacyScheduleRepository = {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getByDate: vi.fn(),
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
    repositoryMock =
      mockPharmacyScheduleRepository as unknown as PharmacyScheduleRepository;
    supabaseProviderMock = mockSupabaseProvider as unknown as SupabaseProvider;

    // Instantiate the PharmacyScheduleService with the mocked repository and provider
    service = new PharmacyScheduleService(supabaseProviderMock, repositoryMock);

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
      const mockData = [PharmacyScheduleMock];
      mockPharmacyScheduleRepository.getAll.mockResolvedValueOnce(mockData);

      const result = await service.getAll();
      expect(result).toBe(mockData);
      expect(repositoryMock.getAll).toHaveBeenCalledOnce();
    });

    it("should call repository.getById and return a post", async () => {
      const id = 1;
      const mockData = { ...PharmacyScheduleMock, id };
      mockPharmacyScheduleRepository.getById.mockResolvedValueOnce(mockData);

      const result = await service.getById(id);
      expect(result).toBe(mockData);
      expect(repositoryMock.getById).toHaveBeenCalledWith(id);
    });

    // Similarly, you could add tests for create, update, and delete
    // if you'd like an extra layer of integration checks.
    // ...
  });

  //
  // PharmacySchedule-specific methods
  //
  describe("Custom PharmacySchedule methods", () => {
    it("should return records by date", async () => {
      const date = new Date();
      const mockData = PharmacyScheduleMock;
      mockPharmacyScheduleRepository.getByDate.mockResolvedValueOnce(mockData);

      const result = await service.getByDate(date);
      expect(result).toBe(mockData);
      expect(repositoryMock.getByDate).toHaveBeenCalledWith(date);
    });
  });
});
