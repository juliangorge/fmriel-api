/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DeathReportMock } from "@/tests/utils/mocks/death-report";

import { DeathReportRepository } from "@/src/contexts/deathReports/api/death-report.repository";
import { DeathReportService } from "@/src/contexts/deathReports/api/death-report.service";
import { SupabaseProvider } from "@/src/contexts/shared/supabase/supabase.provider";

describe("DeathReportService", () => {
  let service: DeathReportService;
  let repository: DeathReportRepository;
  let supabaseProvider: SupabaseProvider;

  const mockDeathReportRepository = {
    getAll: vi.fn(),
    getById: vi.fn(),
    findByQuery: vi.fn(),
  };

  const mockSupabaseProvider = {
    getClient: vi.fn().mockReturnValue({
      from: vi.fn(),
      auth: {
        getSession: vi
          .fn()
          .mockResolvedValue({ session: { user: { id: "test-user-id" } } }),
      },
    }),
  };

  beforeEach(() => {
    repository = mockDeathReportRepository as unknown as DeathReportRepository;
    supabaseProvider = mockSupabaseProvider as unknown as SupabaseProvider;
    service = new DeathReportService(supabaseProvider, repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return all", async () => {
    const mock = [DeathReportMock];
    mockDeathReportRepository.getAll.mockReturnValue(mock);

    const response = await service.getAll();
    expect(response).toBe(mock);
  });

  it("should return by ID", async () => {
    const id = 1;
    const mock = { ...DeathReportMock, id };
    mockDeathReportRepository.getById.mockReturnValue(mock);

    const response = await service.getById(1);
    expect(response).toBe(mock);
  });

  it("should return by query", async () => {
    const query = "test";
    const mock = [DeathReportMock];
    mockDeathReportRepository.findByQuery.mockReturnValue(mock);

    const response = await service.findByQuery(query);
    expect(response).toBe(mock);
  });
});
