/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";

import { SupabaseProvider } from "@/shared/supabase/supabase.provider";

export interface Identifiable {
  id: number;
}

@Injectable()
export class BaseRepository<T extends Identifiable> {
  protected supabase: SupabaseClient;
  protected tableName: string;

  constructor(
    protected supabaseProvider: SupabaseProvider,
    tableName: string,
  ) {
    this.supabase = supabaseProvider.getClient();
    this.tableName = tableName;
  }

  async getAll(
    limit: number = 10,
    offset: number = 0,
    sortBy: string = "id",
    ascending: boolean = true,
  ): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select()
      .order(sortBy, { ascending })
      .range(offset, offset + limit - 1);
    if (error) throw new Error(`Error fetching data: ${error.message}`);
    return data as T[];
  }

  async getById(id: number): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select()
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`Error fetching data: ${error.message}`);
    return data as T;
  }

  async create(data: Omit<T, "id">): Promise<T> {
    const { data: createdData, error } = await this.supabase
      .from(this.tableName)
      .insert(data)
      .select();

    if (error) {
      throw new Error(`Error creating data: ${error.message}`);
    }

    return createdData as unknown as T;
  }

  async update(id: number, data: Partial<Omit<T, "id">>): Promise<T> {
    const { data: updatedData, error } = await this.supabase
      .from(this.tableName)
      .update(data)
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(`Error updating data: ${error.message}`);
    }

    return updatedData as unknown as T;
  }

  async delete(id: number): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(`Error deleting data: ${error.message}`);
    }

    return data as unknown as T;
  }
}
