import { Injectable } from '@nestjs/common';
import {User} from "./user.model";
import {UserRoles} from "@project/models";
@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, name: 'John Doe', postsIds: [1,2], login: '1', password: '1', roles: [UserRoles.USER] },
    { id: 2, name: 'Richard Roe', postsIds: [3,4], login: '2', password: '2', roles: [UserRoles.ADMIN] },
  ];
  findAll(): User[] {
    return this.users;
  }
  findById(id: number): User | undefined {
    return this.users.find((user) => user.id === Number(id));
  }
  findByAuthData(login: string, password: string): User | undefined {
    return this.users.find((user) => user.login === login && user.password === password);
  }
}
