import {Args, ID, Parent, Query, ResolveField, Resolver, ResolveReference} from '@nestjs/graphql';
import { UsersService } from './users.service';
import {User} from "./user.model";
import {Post} from "./post.model";
@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}
  @Query((returns) => User)
  user(@Args({ name: 'id', type: () => ID }) id: number): User | undefined {
    return this.usersService.findById(id);
  }
  @Query((returns) => [User])
  users(): User[] {
    return this.usersService.findAll();
  }
  @ResolveReference()
  resolveReference(reference: { __typename: string; id: number }): User | undefined {
    return this.usersService.findById(reference.id);
  }
  @ResolveField((of) => Post)
  posts(@Parent() user: User): any[] {
    return (user.postsIds || []).map((id) => ({ __typename: 'Post', id }));
  }
}
