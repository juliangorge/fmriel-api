/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DeathReportMock } from "@/tests/utils/mocks/death-report";

import { DeathReportRepository } from "@/src/contexts/deathReports/api/death-report.repository";
import { DeathReportService } from "@/src/contexts/deathReports/api/death-report.service";
import { SupabaseProvider } from "@/src/contexts/shared/supabase/supabase.provider";

describe("DeathReportService", () => {
  let service: DeathReportService;
  let repositoryMock: DeathReportRepository;
  let supabaseProviderMock: SupabaseProvider;

  // You only need to mock the methods that DeathReportService (or BaseService) actually calls
  const mockDeathReportRepository = {
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
    repositoryMock =
      mockDeathReportRepository as unknown as DeathReportRepository;
    supabaseProviderMock = mockSupabaseProvider as unknown as SupabaseProvider;

    // Instantiate the DeathReportService with the mocked repository and provider
    service = new DeathReportService(supabaseProviderMock, repositoryMock);

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
      const mockData = [DeathReportMock];
      mockDeathReportRepository.getAll.mockResolvedValueOnce(mockData);

      const result = await service.getAll();
      expect(result).toBe(mockData);
      expect(repositoryMock.getAll).toHaveBeenCalledOnce();
    });

    it("should call repository.getById and return a post", async () => {
      const id = 1;
      const mockData = { ...DeathReportMock, id };
      mockDeathReportRepository.getById.mockResolvedValueOnce(mockData);

      const result = await service.getById(id);
      expect(result).toBe(mockData);
      expect(repositoryMock.getById).toHaveBeenCalledWith(id);
    });

    // Similarly, you could add tests for create, update, and delete
    // if you'd like an extra layer of integration checks.
    // ...
  });
});
