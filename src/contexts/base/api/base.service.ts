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

  async getAll(): Promise<T[]> {
    return await this.repository.getAll();
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
      throw NotFoundException;
    }

    return await this.repository.update(id, data);
  }
}
