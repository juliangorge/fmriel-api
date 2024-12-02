import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class SignInDto {
  @ApiProperty({
    description: "Email address",
    example: "joedoe@gmail.com",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: "Password",
    example: "strongPassword123",
  })
  @IsNotEmpty()
  password!: string;
}
