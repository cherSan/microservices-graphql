import { Injectable } from '@nestjs/common';
import {User} from "./user.model";
@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, name: 'John Doe', postsIds: [1,2] },
    { id: 2, name: 'Richard Roe', postsIds: [3,4] },
  ];
  findAll(): User[] {
    return this.users;
  }
  findById(id: number): User | undefined {
    return this.users.find((user) => user.id === Number(id));
  }
}
