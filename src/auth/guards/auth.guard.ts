import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(
    private jwtService: JwtService,
    private authService: AuthService){}

  //extraemos o token e validamolo
  async canActivate(context: ExecutionContext):Promise<boolean>  {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if(!token){
      throw new UnauthorizedException('There is no bearer token');
    }
    var message = 'No Match';
    try{
      //co key do user1 vai, co do2 non(invalid signature)
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token, { secret: process.env.JWT_SEED });
      console.log({payload});

      const user = await this.authService.findUserById(payload.id);
      if (!user){ message = 'User does not exist';throw new UnauthorizedException();}
      if (!user.isActive) {message ='User is not active';throw new UnauthorizedException();}
      request['user'] = user;

    }catch(Exception){
      throw new UnauthorizedException(message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined{
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined
  }
}
