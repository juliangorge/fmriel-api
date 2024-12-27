import { ExecutionContext } from "@nestjs/common";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SupabaseAuthGuard } from "@/src/app/auth/guards/supabase-auth-guard";

describe("SupabaseAuthGuard", () => {
  let guard: SupabaseAuthGuard;
  let executionContextMock: ExecutionContext;

  beforeEach(() => {
    guard = new SupabaseAuthGuard();
    // Create a mock ExecutionContext with getArgByIndex
    executionContextMock = {
      getArgByIndex: vi.fn().mockReturnValue("mockRequest"),
      // If your guard or tests require other context methods, add them here
    } as unknown as ExecutionContext;
  });

  it("should call context.getArgByIndex(0) in getRequest method", () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = guard.getRequest(executionContextMock);

    expect(executionContextMock.getArgByIndex).toHaveBeenCalledWith(0);
    expect(request).toBe("mockRequest");
  });
});
