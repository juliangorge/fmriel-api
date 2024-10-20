import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
  @ApiProperty({
    description: "Email address",
    example: "joedoe@gmail.com",
  })
  email!: string;

  @ApiProperty({
    description: "Password",
    example: "strongPassword123",
  })
  password!: string;
}
