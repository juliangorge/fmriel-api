import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class SupabaseAuthGuard extends AuthGuard("supabase") {
  getRequest(context: ExecutionContext) {
    // console.log("in auth guard");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return context.getArgByIndex(0);
  }
}
