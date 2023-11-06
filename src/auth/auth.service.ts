import { BadRequestException, Injectable, InternalServerErrorException, Post, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as bcryptjs from "bcryptjs";

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';
import { RegisterUserDto } from './dto';

//para ver os cambios no MondoDBCompass ctrl+R, a veces non refresca
@Injectable()
export class AuthService {


  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) { }

  //async + await e aparece o erro en consola(o nº)
  async create(createUserDto: CreateUserDto)/*: Promise<User>*/ {
    //debe coincidir o nomeCampo co campo enviado por postman/o que sexa
    try {
      //0-desestructuramos os contidos que venhen no createUserDto para traballar con iles
      const { password, ...userData } = createUserDto;
      //1-encriptar contrasinal -> npm i bcryptjs -> npm i --save-dev @types/bcryptjs
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });
      //2-guardar usuario, + cando sae no postman non ensinar o contrasinal cifrado:
      await newUser.save();
      const { password: _, ...user } = newUser.toJSON();
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} already exists`);
      }
      throw new InternalServerErrorException('Something wrong happened! :(')
    }

  }


  async login(loginDto: LoginDto): Promise<LoginResponse> {
    //debe regresa o usuario(user=_id,name,email,roles) e JWT(JasonWebToken)(ASDAS.ASDAS.ASDASD.ASDAS)
    //crear un DTO, mapearlo validarlo e recibir informacion esperada
    const { email, password} = loginDto;
    const user = await this.userModel.findOne({email});
    if(!user){
      throw new UnauthorizedException('Invalid Credentials - email');
    }
    if(!bcryptjs.compareSync(password, user.password)){
      throw new UnauthorizedException('Invalid Credentials - password')
    }
    const {password:_, ...rest} = user.toJSON();
    return {
      user: rest, token: this.getJwtToken({id: user.id} ),
    }
  }

  async register(registerDto: RegisterUserDto):Promise <LoginResponse>{
    // const user = await this.create( {email: registerDto.email..});
    const user = await this.create( registerDto);
    console.log({user});
    return{
      user: user,
      token: this.getJwtToken({id: user._id})
    }
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }
  async findUserById(id: string){
    const user = await this.userModel.findById(id);
    const{password, ...rest} = user.toJSON(); //asi collemos o user sen o contrasinal
    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken(payload: JwtPayload){
     const token = this.jwtService.sign(payload);
     return token;
  }
}
