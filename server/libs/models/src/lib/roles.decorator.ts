import { Reflector } from '@nestjs/core';
export enum UserRoles {
  GUEST,
  USER,
  ADMIN
}
export const Roles = Reflector.createDecorator<UserRoles[]>();
