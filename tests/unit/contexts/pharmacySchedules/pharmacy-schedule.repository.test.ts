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

  beforeEach(() => {
    // 1. Create a base supabase mock where only .from() is defined.
    supabaseMock = {
      from: vi.fn(),
    } as unknown as SupabaseClient;

    // 2. Mock the provider to return our supabaseMock
    supabaseProviderMock = {
      getClient: vi.fn().mockReturnValue(supabaseMock),
    } as unknown as SupabaseProvider;

    // 3. Instantiate the repository with the mock provider
    repository = new PharmacyScheduleRepository(supabaseProviderMock);
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear mocks between tests
  });

  /*
   * getAll (SUCCESS)
   * If your repository calls:
   *    .from(tableName)
   *      .select()
   *      .order(...)
   *      .range(...)
   * you need to mock the chain.
   * Otherwise, if it's just .select(), keep it simple.
   */
  it("should fetch all records in getAll", async () => {
    const mockData = [PharmacyScheduleMock] as PharmacySchedule[];

    // 1. Final link in chain: range(...) -> returns a Promise
    const rangeMock = vi.fn().mockResolvedValue({
      data: mockData,
      error: null,
    });
    // 2. Next link: order(...) returns an object with range
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    // 3. Next link: select(...) returns an object with order
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });

    // 4. .from(tableName) returns an object with select
    (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

    const result = await repository.getAll();
    // If your getAll calls .order(...).range(...), this chain will be used

    expect(result).toEqual(mockData);

    // Check the chain
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(selectMock).toHaveBeenCalled();
    expect(orderMock).toHaveBeenCalledWith("id", { ascending: true });
    // default sort? depends on your repository
    expect(rangeMock).toHaveBeenCalledWith(0, 9);
    // default offset=0, limit=10 => range(0, 9)
  });

  /*
   * getAll (ERROR)
   */
  it("should throw an error when getAll fails", async () => {
    const mockError = { message: "Failed to fetch data" };

    // Build the chain but return an error at the final step
    const rangeMock = vi.fn().mockResolvedValue({
      data: null,
      error: mockError,
    });
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });

    (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

    await expect(repository.getAll()).rejects.toThrow(
      "Error fetching data: Failed to fetch data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(selectMock).toHaveBeenCalled();
    expect(orderMock).toHaveBeenCalledWith("id", { ascending: true });
    expect(rangeMock).toHaveBeenCalledWith(0, 9);
  });

  /*
   * getById (SUCCESS)
   * from(tableName).select(...).eq("id", id).maybeSingle()
   */
  it("should fetch a record by ID in getById", async () => {
    const mockPharmacySchedule = PharmacyScheduleMock as PharmacySchedule;

    // Build the chain: .maybeSingle() => resolves final data
    const maybeSingleMock = vi.fn().mockResolvedValue({
      data: mockPharmacySchedule,
      error: null,
    });
    const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

    const result = await repository.getById(mockPharmacySchedule.id);

    expect(result).toEqual(mockPharmacySchedule);

    // Verify the chain
    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(selectMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("id", mockPharmacySchedule.id);
    expect(maybeSingleMock).toHaveBeenCalled();
  });

  /*
   * getById (ERROR)
   */
  it("should throw an error when getById fails", async () => {
    const mockId = 1;
    const mockError = { message: "Failed to fetch data" };

    // Chain, but final returns error
    const maybeSingleMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: mockError });
    const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

    await expect(repository.getById(mockId)).rejects.toThrow(
      "Error fetching data: Failed to fetch data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(selectMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("id", mockId);
    expect(maybeSingleMock).toHaveBeenCalled();
  });

  /*
   * EXAMPLE: getByDate (SUCCESS)
   * If your repository code is something like:
   *   from(tableName)
   *     .select(...)
   *     .gte("start_date", dateStart)
   *     .lte("end_date", dateEnd)
   *     .maybeSingle()
   * Then you need a chain: select -> gte -> lte -> maybeSingle
   *
   * The following tests are only examples. Uncomment & adapt if your code uses them!
   */
  it("should fetch records for a specific date in getByDate", async () => {
    const mockPharmacySchedule = PharmacyScheduleMock as PharmacySchedule;
    const formattedDate = "2023-12-25";
    const testDate = new Date(formattedDate);

    // Final link in chain
    const maybeSingleMock = vi.fn().mockResolvedValue({
      data: mockPharmacySchedule,
      error: null,
    });
    // lte returns object with maybeSingle
    const lteMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    // gte returns object with lte
    const gteMock = vi.fn().mockReturnValue({ lte: lteMock });
    // select returns object with gte
    const selectMock = vi.fn().mockReturnValue({ gte: gteMock });

    (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

    const result = await repository.getByDate(testDate);

    // Suppose repository transforms a single record to an array or something similar
    // Adjust your assertion if your code does something different
    expect(result).toEqual(PharmacyScheduleMock);

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(selectMock).toHaveBeenCalled();
    expect(gteMock).toHaveBeenCalledWith("start_date", formattedDate);
    expect(lteMock).toHaveBeenCalledWith("end_date", formattedDate);
    expect(maybeSingleMock).toHaveBeenCalled();
  });

  it("should throw an error when getByDate fails", async () => {
    const formattedDate = "2023-12-25";
    const testDate = new Date(formattedDate);
    const mockError = { message: "Failed to fetch data" };

    const maybeSingleMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: mockError });
    const lteMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const gteMock = vi.fn().mockReturnValue({ lte: lteMock });
    const selectMock = vi.fn().mockReturnValue({ gte: gteMock });

    (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

    await expect(repository.getByDate(testDate)).rejects.toThrow(
      "Error fetching data: Failed to fetch data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(selectMock).toHaveBeenCalled();
    expect(gteMock).toHaveBeenCalledWith("start_date", formattedDate);
    expect(lteMock).toHaveBeenCalledWith("end_date", formattedDate);
    expect(maybeSingleMock).toHaveBeenCalled();
  });
});
