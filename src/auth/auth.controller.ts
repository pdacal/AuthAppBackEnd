import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

import{CreateUserDto,LoginDto,RegisterUserDto, } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { User } from './entities/user.entity';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  //peticion POST, o que ven da peticion transformase a createAuthDto
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  Login(@Body() loginDto: LoginDto) {
    //en postman localhost:3000/auth/login + email+password do usuario da bd
    return this.authService.login(loginDto);
  }

  @Post('/register')
  register(@Body() registerDto: RegisterUserDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll( @Request() req: Request ) {
    const user = req['user'];
   // return user;
    return this.authService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get('check-token')
  checkToken(@Request() req: Request ):LoginResponse{
    //saco o user do request
    const user = req['user'] as User;
    //devolvo o user e o token, o token sacamolo do authService co id do user
    return {user, token: this.authService.getJwtToken({id: user._id})}
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
