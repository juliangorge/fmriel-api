/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unicorn/no-null */
import { Test, TestingModule } from "@nestjs/testing";
import { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { PostSectionMock } from "@/tests/utils/mocks/post-section";

import { PostSectionRepository } from "@/src/contexts/postSections/api/post-section.repository";

describe("PostSectionRepository", () => {
  let repository: PostSectionRepository;
  let supabaseMock: SupabaseClient;

  beforeEach(async () => {
    supabaseMock = {
      from: vi.fn(),
    } as unknown as SupabaseClient;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostSectionRepository,
        { provide: SupabaseClient, useValue: supabaseMock }, // Provide the mock SupabaseClient
      ],
    }).compile();

    repository = module.get<PostSectionRepository>(PostSectionRepository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // eslint-disable-next-line vitest/no-commented-out-tests
  /*
  it("should fetch successfully", async () => {
    // Mock the Supabase query chain
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: PostSectionMock,
        error: null,
      }),
    });

    (supabaseMock.from as Mock).mockReturnValue({
      select: mockSelect,
    });

    const result = await repository.findAll();

    expect(supabaseMock.from).toHaveBeenCalledWith("post_sections");
    expect(supabaseMock.from("post_sections").select).toHaveBeenCalled();
    expect(result).toEqual(PostSectionMock);
  });

  it("should throw an error when fetching fails", async () => {
    const mockError = { message: "Failed to fetch data" };

    (supabaseMock.from as Mock).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValueOnce({
            data: {
              id: 1,
              title: "Post Section 1",
            },
            error: mockError,
          }),
        }),
      }),
    });

    await expect(repository.findById(1)).rejects.toThrow(
      "Error fetching data: Failed to fetch data",
    );

    expect(supabaseMock.from).toHaveBeenCalledWith("post_sections");
    expect(supabaseMock.from("post_sections").select).toHaveBeenCalledWith();
    expect(supabaseMock.from("post_sections").select().eq).toHaveBeenCalledWith(
      "id",
      1,
    );
    expect(
      supabaseMock.from("post_sections").select().eq("id", 1).maybeSingle,
    ).toHaveBeenCalled();
  });
   */
});
