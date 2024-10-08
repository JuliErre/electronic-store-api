import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(loginUserDto);
      return res.status(HttpStatus.OK).json(result); // 200 OK
    } catch (error) {
      return res.status(error.getStatus()).json({ message: error.message });
    }
  }

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res() res: Response,
  ) {
    try {
      const newUser = await this.authService.registerUser(registerUserDto);
      return res.status(HttpStatus.CREATED).json(newUser); // 201 Created
    } catch (error) {
      return res.status(error.getStatus()).json({ message: error.message });
    }
  }
}
