import { Injectable, NotFoundException } from "@nestjs/common";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

import { BaseRepository } from "./base.repository";

interface Identifiable {
  id: number;
}

@Injectable()
export class BaseService<T extends Identifiable> {
  constructor(
    protected readonly supabaseProvider: SupabaseProvider,
    protected readonly repository: BaseRepository<T>,
  ) {}

  async getAll(
    limit: number = 10,
    offset: number = 0,
    sortBy: string = "id",
    ascending: boolean = true,
  ): Promise<T[]> {
    return await this.repository.getAll(limit, offset, sortBy, ascending);
  }

  async getById(id: number): Promise<T | null> {
    return await this.repository.getById(id);
  }

  async create(data: Omit<T, "id">): Promise<T> {
    return await this.repository.create(data);
  }

  async update(id: number, data: Partial<Omit<T, "id">>): Promise<T> {
    const entity = await this.repository.getById(id);
    if (!entity) {
      throw new NotFoundException();
    }

    return await this.repository.update(id, data);
  }

  async delete(id: number): Promise<T> {
    const entity = await this.repository.getById(id);
    if (!entity) {
      throw new NotFoundException();
    }

    return await this.repository.delete(id);
  }
}
