import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../../user/user.schema';

export class RegisterDto {
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsStrongPassword({ minLength: 6 }, { message: 'Password is too weak' })
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsEnum(UserRole, { message: 'Invalid role, Must be Admin Or User' })
  @IsNotEmpty()
  role: UserRole;
}
