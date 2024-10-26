import { Controller, Post, Body, BadRequestException } from '@nestjs/common';

import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    const { username, password } = createUserDto;
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    await this.usersService.createUser(username, password);
    return { message: 'User created successfully' };
  }
}
