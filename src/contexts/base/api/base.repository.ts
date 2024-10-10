/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

interface Identifiable {
  id: number;
}

@Injectable()
export class BaseRepository<T extends Identifiable> {
  protected supabase: SupabaseClient;
  protected tableName: string;

  constructor(tableName: string) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Supabase URL or Key is missing from environment variables",
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.tableName = tableName;
  }

  async findAll(): Promise<T[]> {
    const { data, error } = await this.supabase.from(this.tableName).select();
    if (error) throw new Error(`Error fetching data: ${error.message}`);
    return (data as T[]) || [];
  }

  async findById(id: number): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select()
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`Error fetching data: ${error.message}`);
    return data as T;
  }
}
