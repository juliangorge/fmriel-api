/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable unicorn/no-null */
import { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { DeathReportMock } from "@/tests/utils/mocks/death-report";

import { DeathReport } from "@/src/contexts/deathReports/api/death-report.model";
import { DeathReportRepository } from "@/src/contexts/deathReports/api/death-report.repository";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

describe("DeathReportRepository", () => {
  let repository: DeathReportRepository;
  let supabaseMock: SupabaseClient;
  let supabaseProviderMock: SupabaseProvider;
  const tableName = "death_reports";

  beforeEach(() => {
    // Mock supabase client
    supabaseMock = {
      from: vi.fn(), // We'll chain .select(), .eq(), .maybeSingle(), etc. on this
    } as unknown as SupabaseClient;

    // Mock provider to return our mocked supabase client
    supabaseProviderMock = {
      getClient: vi.fn().mockReturnValue(supabaseMock),
    } as unknown as SupabaseProvider;

    // Instantiate the actual repository with the mocked provider
    repository = new DeathReportRepository(supabaseProviderMock);

    // Clear calls so each test starts fresh
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch all records (success)", async () => {
      const mockData: DeathReport[] = [DeathReportMock, DeathReportMock];

      // If you do ordering/pagination, you'll have something like:
      // .select() -> .order() -> .range().
      // Here’s the full chain if you rely on the BaseRepository’s logic:

      const rangeMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null });
      const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
      const selectMock = vi.fn().mockReturnValue({ order: orderMock });

      (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

      // Act
      const result = await repository.getAll(); // Default limit=10, offset=0, etc.

      // Assert
      expect(result).toEqual(mockData);
      expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
      expect(selectMock).toHaveBeenCalled(); // or .toHaveBeenCalledWith() if you pass arguments
      expect(orderMock).toHaveBeenCalledWith("id", { ascending: true });
      expect(rangeMock).toHaveBeenCalledWith(0, 9); // offset=0, limit=10 => 0..9
    });

    it("should throw an error when getAll fails", async () => {
      const mockError = { message: "Failed to fetch data" };

      const rangeMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: mockError });
      const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
      const selectMock = vi.fn().mockReturnValue({ order: orderMock });
      (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

      await expect(repository.getAll()).rejects.toThrow(
        "Error fetching data: Failed to fetch data",
      );
      expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    });
  });

  describe("getById", () => {
    it("should fetch a record by ID (success)", async () => {
      const mockDeathReport: DeathReport = DeathReportMock;

      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: mockDeathReport, error: null });
      const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

      (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

      // Act
      const result = await repository.getById(1);

      // Assert
      expect(result).toEqual(mockDeathReport);
      expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
      expect(selectMock).toHaveBeenCalled();
      expect(eqMock).toHaveBeenCalledWith("id", 1);
      expect(maybeSingleMock).toHaveBeenCalled();
    });

    it("should throw an error when getById fails", async () => {
      const mockError = { message: "Failed to fetch data" };

      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: mockError });
      const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

      (supabaseMock.from as Mock).mockReturnValue({ select: selectMock });

      await expect(repository.getById(1)).rejects.toThrow(
        "Error fetching data: Failed to fetch data",
      );
      expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
      expect(selectMock).toHaveBeenCalled();
    });
  });
});
