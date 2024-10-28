/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable unicorn/no-null */
import { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { PharmacyScheduleMock } from "@/tests/utils/mocks/pharmacy-schedule";

import { PharmacySchedule } from "@/src/contexts/pharmacySchedules/api/pharmacy-schedule.model";
import { PharmacyScheduleRepository } from "@/src/contexts/pharmacySchedules/api/pharmacy-schedule.repository";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

describe("PharmacyScheduleRepository", () => {
  let repository: PharmacyScheduleRepository;
  let supabaseMock: SupabaseClient;
  let supabaseProviderMock: SupabaseProvider;
  const tableName = "pharmacy_schedules";

  let selectMock: Mock;

  beforeEach(() => {
    // Mock SupabaseClient methods
    selectMock = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    });

    supabaseMock = {
      from: vi.fn(() => ({
        select: selectMock,
      })),
    } as unknown as SupabaseClient;

    // Mock SupabaseProvider to return the mock SupabaseClient
    supabaseProviderMock = {
      getClient: vi.fn().mockReturnValue(supabaseMock),
    } as unknown as SupabaseProvider;

    // Initialize the repository with the mock provider
    repository = new PharmacyScheduleRepository(supabaseProviderMock);
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear mocks after each test
  });

  it("should fetch all records in getAll", async () => {
    const mockData = [PharmacyScheduleMock] as PharmacySchedule[];

    selectMock.mockResolvedValueOnce({
      data: mockData,
      error: null,
    });

    const result = await repository.getAll();

    expect(result).toEqual(mockData);

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
  });

  it("should throw an error when getAll fails", async () => {
    const mockError = { message: "Failed to fetch data" };
    selectMock.mockResolvedValueOnce({
      data: null,
      error: mockError,
    });

    await expect(repository.getAll()).rejects.toThrow(
      "Error fetching data: Failed to fetch data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
  });

  it("should fetch a record by ID in getById", async () => {
    const mockPharmacySchedule = PharmacyScheduleMock as PharmacySchedule;

    (supabaseMock.from as Mock).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValueOnce({
            data: mockPharmacySchedule,
            error: null,
          }),
        }),
      }),
    });

    const result = await repository.getById(mockPharmacySchedule.id);

    expect(result).toEqual(mockPharmacySchedule);

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
    expect(supabaseMock.from(tableName).select().eq).toHaveBeenCalledWith(
      "id",
      mockPharmacySchedule.id,
    );
    expect(
      supabaseMock.from(tableName).select().eq("id", mockPharmacySchedule.id)
        .maybeSingle,
    ).toHaveBeenCalled();
  });

  it("should throw an error when getById fails", async () => {
    const mockId = 1;
    const mockError = { message: "Failed to fetch data" };

    (supabaseMock.from as Mock).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValueOnce({
            data: null,
            error: mockError,
          }),
        }),
      }),
    });

    await expect(repository.getById(mockId)).rejects.toThrow(
      "Error fetching data: Failed to fetch data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
    expect(supabaseMock.from(tableName).select().eq).toHaveBeenCalledWith(
      "id",
      mockId,
    );
    expect(
      supabaseMock.from(tableName).select().eq("id", mockId).maybeSingle,
    ).toHaveBeenCalled();
  });

  // eslint-disable-next-line vitest/no-commented-out-tests
  /*
  it("should fetch records for a specific date in getByDate", async () => {
    const mockPharmacySchedule = PharmacyScheduleMock as PharmacySchedule;
    const testDate = new Date("2023-10-15");

    (supabaseMock.from as Mock).mockReturnValue({
      select: vi.fn().mockReturnValue({
        gte: vi.fn().mockReturnValue({
          lte: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValueOnce({
              data: mockPharmacySchedule,
              error: null,
            }),
          }),
        }),
      }),
    });

    const result = await repository.getByDate(testDate);

    expect(result).toEqual([PharmacyScheduleMock]);

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
    expect(supabaseMock.from(tableName).select().eq).toHaveBeenCalledWith(
      "date",
      testDate.toISOString(),
    );
  });

  it("should throw an error when getByDate fails", async () => {
    const testDate = new Date("2023-10-15");
    const mockError = { message: "Failed to fetch data" };

    (supabaseMock.from as Mock).mockReturnValue({
      select: vi.fn().mockReturnValue({
        gte: vi.fn().mockReturnValue({
          lte: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValueOnce({
              data: null,
              error: mockError,
            }),
          }),
        }),
      }),
    });

    await expect(repository.getByDate(testDate)).rejects.toThrow(
      "Error fetching data: Failed to fetch data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
    expect(supabaseMock.from(tableName).select().eq).toHaveBeenCalledWith(
      "date",
      testDate.toISOString(),
    );
  });

  it("should return an empty array if no records found for the date", async () => {
    const testDate = new Date("2023-12-31");

    (supabaseMock.from as Mock).mockReturnValue({
      select: vi.fn().mockReturnValue({
        gte: vi.fn().mockReturnValue({
          lte: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValueOnce({
              data: [],
              error: null,
            }),
          }),
        }),
      }),
    });

    const result = await repository.getByDate(testDate);

    expect(result).toEqual([]);
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(supabaseMock.from(tableName).select).toHaveBeenCalled();
    expect(supabaseMock.from(tableName).select().eq).toHaveBeenCalledWith(
      "date",
      testDate.toISOString(),
    );
  });
  */
});
