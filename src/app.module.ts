import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

//sen especificar a db-name non funciona, quiteino de .env e puxeno eiqui e funciona
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {dbName: 'mean-db'}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  constructor(){
   // console.log(process.env); //para velo na terminal
  }
}
