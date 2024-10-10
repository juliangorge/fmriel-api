import { Injectable } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
// import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class AuthService {
  private supabaseClient: SupabaseClient;
  constructor() {
    this.supabaseClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
    );
  }

  async signInUser(dto: { email: string; password: string }) {
    const { data, error } = await this.supabaseClient.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    return {
      user: data.user,
      session: data.session,
      error: error,
    };
  }

  // async signupUser(dto: CreateUserDto) {
  //   const { user, session, error } = await this.supabaseClient.auth.signUp(
  //     {
  //       email: dto.email,
  //       password: dto.password,
  //     },
  //     /*,{
  //             data: {
  //               first_name: 'John',
  //               age: 27,
  //             }
  //           }*/
  //   );

  //   console.log(user);
  //   console.log(session);
  //   console.log(error);

  //   return {
  //     user: user,
  //     session: session,
  //     error: error,
  //   };
  // }
}
