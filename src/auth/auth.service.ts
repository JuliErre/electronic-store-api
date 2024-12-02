import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from './../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user-dto';
import { HashService } from './hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly hashService: HashService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<{
    id: any;
    email: string;
    username: string;
  }> {
    const user = await this.usersService.findOneByEmail(email);
    if (
      user &&
      (await this.hashService.comparePassword(password, user.password))
    ) {
      // Si la contraseña es correcta
      return {
        id: user._id,
        email: user.email,
        username: user.username,
      };
    }
    throw new UnauthorizedException('Invalid email or password');
  }
  async login(user: LoginUserDto) {
    const validateUser = await this.validateUser(user.email, user.password);
    const payload = { username: validateUser.username, sub: validateUser.id };

    return {
      access_token: this.jwtService.sign(payload),
      ...validateUser,
    };
  }

  async registerUser(data: RegisterUserDto): Promise<any> {
    const user = await this.usersService.findOneByEmail(data.email);
    if (user) {
      throw new ConflictException('Email already used');
    }
    const hashedPassword = await this.hashService.hashPassword(data.password);
    const defaultRole = 'user';
    const newUser = await this.usersService.create({
      ...data,
      password: hashedPassword,
      role: defaultRole,
    });
    return {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
    };
  }
}
