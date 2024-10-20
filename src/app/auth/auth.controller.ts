import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { SignInDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
@ApiTags("authentication")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signIn")
  @ApiOperation({
    summary: "Acquires an access token",
    description: "This endpoint will provide an access token.",
  })
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signInUser(dto);
  }
}
