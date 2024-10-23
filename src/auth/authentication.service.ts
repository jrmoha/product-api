import {
  Injectable,
  ConflictException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto, RegisterDto } from './dto';
import { User } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register({ email, password, role }: RegisterDto) {
    const emailExists = await this.userModel.findOne({ email });
    if (emailExists) throw new ConflictException('Email already exists');

    await this.userModel.create({ email, password, role });
    return {
      message: 'User registered successfully',
      status: HttpStatus.CREATED,
    };
  }
  async login({ email, password }: LoginDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('this email does not exist');

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) throw new UnauthorizedException('Invalid password');

    const token = this.jwtService.sign({
      _id: user._id,
      email: user.email,
      role: user.role,
    });
    return {
      message: 'User logged in successfully',
      status: HttpStatus.OK,
      token,
    };
  }
}
