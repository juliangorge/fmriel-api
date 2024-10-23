/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PostMock } from "@/tests/utils/mocks/post";

import { PostSectionRepository } from "@/src/contexts/postSections/api/post-section.repository";
import { PostSectionService } from "@/src/contexts/postSections/api/post-section.service";
import { SupabaseProvider } from "@/src/contexts/shared/supabase/supabase.provider";

describe("PostSectionService", () => {
  let service: PostSectionService;
  let repository: PostSectionRepository;
  let supabaseProvider: SupabaseProvider;

  const mockPostSectionRepository = {
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
    repository = mockPostSectionRepository as unknown as PostSectionRepository;
    supabaseProvider = mockSupabaseProvider as unknown as SupabaseProvider;
    service = new PostSectionService(supabaseProvider, repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return all", async () => {
    const mock = [PostMock];
    mockPostSectionRepository.getAll.mockReturnValue(mock);

    const response = await service.getAll();
    expect(response).toBe(mock);
  });

  it("should return by ID", async () => {
    const id = 1;
    const mock = { ...PostMock, id };
    mockPostSectionRepository.getById.mockReturnValue(mock);

    const response = await service.getById(1);
    expect(response).toBe(mock);
  });
});
