import {Injectable, ExecutionContext, CanActivate, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {GqlExecutionContext} from "@nestjs/graphql";
import {Reflector} from "@nestjs/core";
import {Roles} from "./roles.decorator";
import {AuthenticationError} from "@nestjs/apollo";
function match(userRoles: string[], roles: string[]) {
  return userRoles?.some(role => roles.includes(role));
}
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext()?.req;
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();
    try {
      const user = await this.jwtService.verifyAsync(token);
      request['user'] = user;
      if (roles && !match(user.roles, roles)) throw new AuthenticationError('User Has No Access');
    } catch(e) {
      throw new AuthenticationError((e as any)?.message || e);
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = (request.headers as any)['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
