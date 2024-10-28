/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RainCityMock } from "@/tests/utils/mocks/rain-city";

import { RainCityRepository } from "@/src/contexts/rainCities/api/rain-city.repository";
import { RainCityService } from "@/src/contexts/rainCities/api/rain-city.service";
import { SupabaseProvider } from "@/src/contexts/shared/supabase/supabase.provider";

describe("RainCityService", () => {
  let service: RainCityService;
  let repository: RainCityRepository;
  let supabaseProvider: SupabaseProvider;

  const mockRainCityRepository = {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
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
    repository = mockRainCityRepository as unknown as RainCityRepository;
    supabaseProvider = mockSupabaseProvider as unknown as SupabaseProvider;
    service = new RainCityService(supabaseProvider, repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return all", async () => {
    const mock = [RainCityMock];
    mockRainCityRepository.getAll.mockReturnValue(mock);

    const response = await service.getAll();
    expect(response).toBe(mock);
  });

  it("should return by ID", async () => {
    const id = 1;
    const mock = { ...RainCityMock, id };
    mockRainCityRepository.getById.mockReturnValue(mock);

    const response = await service.getById(1);
    expect(response).toBe(mock);
  });

  it("should create a new record", async () => {
    const mock = RainCityMock;
    mockRainCityRepository.create.mockReturnValue(mock);

    const response = await service.create(mock);
    expect(response).toBe(mock);
  });

  it("should update a record", async () => {
    const id = 1;
    const mock = { ...RainCityMock, id };
    mockRainCityRepository.getById.mockReturnValue(mock);

    mockRainCityRepository.update.mockReturnValue(mock);

    const response = await service.update(id, mock);
    expect(response).toBe(mock);
  });

  it("should delete a record", async () => {
    const id = 1;
    const mock = { ...RainCityMock, id };
    mockRainCityRepository.getById.mockReturnValue(mock);

    mockRainCityRepository.delete.mockReturnValue(mock);

    const response = await service.delete(id);
    expect(response).toBe(mock);
  });
});
