/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PharmacyScheduleMock } from "@/tests/utils/mocks/pharmacy-schedule";

import { PharmacyScheduleRepository } from "@/src/contexts/pharmacySchedules/api/pharmacy-schedule.repository";
import { PharmacyScheduleService } from "@/src/contexts/pharmacySchedules/api/pharmacy-schedule.service";
import { SupabaseProvider } from "@/src/contexts/shared/supabase/supabase.provider";

describe("PharmacyScheduleService", () => {
  let service: PharmacyScheduleService;
  let repository: PharmacyScheduleRepository;
  let supabaseProvider: SupabaseProvider;

  const mockPharmacyScheduleRepository = {
    getAll: vi.fn(),
    getById: vi.fn(),
    getByDate: vi.fn(),
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
    repository =
      mockPharmacyScheduleRepository as unknown as PharmacyScheduleRepository;
    supabaseProvider = mockSupabaseProvider as unknown as SupabaseProvider;
    service = new PharmacyScheduleService(supabaseProvider, repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return all", async () => {
    const mock = [PharmacyScheduleMock];
    mockPharmacyScheduleRepository.getAll.mockReturnValue(mock);

    const response = await service.getAll();
    expect(response).toBe(mock);
  });

  it("should return by ID", async () => {
    const id = 1;
    const mock = { ...PharmacyScheduleMock, id };
    mockPharmacyScheduleRepository.getById.mockReturnValue(mock);

    const response = await service.getById(1);
    expect(response).toBe(mock);
  });

  it("should return by date", async () => {
    const date = new Date();
    const mock = [PharmacyScheduleMock];
    mockPharmacyScheduleRepository.getByDate.mockReturnValue(mock);

    const response = await service.getByDate(date);
    expect(response).toBe(mock);
  });
});
