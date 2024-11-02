import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  
@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userIdFromRequest = request.params.userId || request.body.userId;

    if (!userIdFromRequest) {
    throw new UnauthorizedException('No userId provided in the request.');
    }
    if (user.id !== Number(userIdFromRequest)) {
    throw new UnauthorizedException('Access denied. You do not own this resource.');
    }
    return true;
  }
}
  