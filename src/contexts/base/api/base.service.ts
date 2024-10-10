import { Injectable } from "@nestjs/common";

import { BaseRepository } from "./base.repository";

interface Identifiable {
  id: number;
}

@Injectable()
export class BaseService<T extends Identifiable> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  async getAll(): Promise<T[]> {
    return await this.repository.findAll();
  }

  async getById(id: number): Promise<T | null> {
    return await this.repository.findById(id);
  }
}
