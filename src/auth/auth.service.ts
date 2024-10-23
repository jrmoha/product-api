import {
  Injectable,
  ConflictException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto';
import { User } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register user
   * @param {RegisterDto} body - Register details
   * @throws {ConflictException} - Email already exists
   */
  async register({ email, password, role }: RegisterDto) {
    const emailExists = await this.userModel.findOne({ email });
    if (emailExists) throw new ConflictException('Email already exists');

    await this.userModel.create({ email, password, role });
    return {
      message: 'User registered successfully',
      status: HttpStatus.CREATED,
    };
  }
  /**
   * Login user
   * @param {LoginDto} body - Login details
   * @throws {NotFoundException} - Email not found
   * @throws {UnauthorizedException} - Invalid password
   */
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
      status: true,
      token,
    };
  }
  /**
   * Get user by id
   * @param {string} _id - User id
   * @returns {Promise<User|null>} - User details
   */
  async getUser(_id: string): Promise<User | null> {
    return this.userModel
      .findById(_id)
      .select('-password -__v -createdAt -updatedAt');
  }
}
