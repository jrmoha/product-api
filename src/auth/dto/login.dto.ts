import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsStrongPassword({ minLength: 6 }, { message: 'Password is too weak' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
