/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PharmacyMock } from "@/tests/utils/mocks/pharmacy";

import { PharmacyRepository } from "@/src/contexts/pharmacies/api/pharmacy.repository";
import { PharmacyService } from "@/src/contexts/pharmacies/api/pharmacy.service";
import { SupabaseProvider } from "@/src/contexts/shared/supabase/supabase.provider";

describe("PharmacyService", () => {
  let service: PharmacyService;
  let repository: PharmacyRepository;
  let supabaseProvider: SupabaseProvider;

  const mockPharmacyRepository = {
    getAll: vi.fn(),
    getById: vi.fn(),
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
    repository = mockPharmacyRepository as unknown as PharmacyRepository;
    supabaseProvider = mockSupabaseProvider as unknown as SupabaseProvider;
    service = new PharmacyService(supabaseProvider, repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return all", async () => {
    const mock = [PharmacyMock];
    mockPharmacyRepository.getAll.mockReturnValue(mock);

    const response = await service.getAll();
    expect(response).toBe(mock);
  });

  it("should return by ID", async () => {
    const id = 1;
    const mock = { ...PharmacyMock, id };
    mockPharmacyRepository.getById.mockReturnValue(mock);

    const response = await service.getById(1);
    expect(response).toBe(mock);
  });
});
