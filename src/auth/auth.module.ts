import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from './entities/user.entity';


@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:  [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
    { name: User.name, 
      schema: UserSchema }
    ]),
    //sen envolver o secret asi non me funcionaba, comprobar co console.log que non vai nulo!!!
    // `${process.env.JWT_SEED}`
  JwtModule.register({
    global:true,
    secret: `${process.env.JWT_SEED}`,
    signOptions: { expiresIn: '6h'},
   })
]
})
export class AuthModule {}
