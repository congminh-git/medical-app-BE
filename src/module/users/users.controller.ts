import { Controller, Get, Put, Delete, Param, Body, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from '../auth/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return await this.usersService.getUserById(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() updateUserDto: any) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Post('')
  async addUser(@Body() addUserDto: any) {
    return await this.usersService.registerUser(addUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return await this.usersService.deleteUser(id);
  }

  @Public()
  @Post('/register')
  async registerUser(@Body() body) {
    return await this.usersService.registerUser(body);
  }

  @Public()
  @Post('login')
  async loginUser(@Body() body) {
    return await this.usersService.loginUser(body.email, body.password);
  }

  @Get('/image/:id')
  async getUserImage(@Param('id') id: number) {
    return await this.usersService.getUserImage(id);
  }

  @Put(':id/image')
  async updateUserImage(@Param('id') id: number, @Body() updateUserDto: any) {
    return await this.usersService.updateUserImage(id, updateUserDto);
  }
}