import {Args, ID,  Mutation, Parent, Query, ResolveField, Resolver, ResolveReference} from '@nestjs/graphql';
import {AuthenticationError} from "@nestjs/apollo";
import {JwtService} from "@nestjs/jwt";
import { UsersService } from './users.service';
import {Auth, User} from "./user.model";
import {Post} from "./post.model";
import {UseGuards} from "@nestjs/common";
import {AuthGuard, Roles} from "@project/models";

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
    ) {}
  @UseGuards(AuthGuard)
  @Roles(['USER'])
  @Query((returns) => User)
  user(@Args({ name: 'id', type: () => ID }) id: number): User | undefined {
    return this.usersService.findById(id);
  }
  @UseGuards(AuthGuard)
  @Roles(['USER'])
  @Query((returns) => [User])
  users(): User[] {
    return this.usersService.findAll();
  }
  @UseGuards(AuthGuard)
  @Roles(['GUEST'])
  @Mutation((returns) => String)
  async login(@Args({ name: 'auth', type: () => Auth }) auth: Auth): Promise<string> {
    const user = this.usersService.findByAuthData(auth.login, auth.password);
    if (!user) throw new AuthenticationError('Wrong Login or Password');
    const payload = { sub: user.login, username: user.name, roles: user.roles };
    return this.jwtService.signAsync(payload)
  }
  @UseGuards(AuthGuard)
  @Roles(['USER'])
  @ResolveReference()
  resolveReference(reference: { __typename: string; id: number }): User | undefined {
    return this.usersService.findById(reference.id);
  }
  @UseGuards(AuthGuard)
  @Roles(['USER'])
  @ResolveField((of) => Post)
  posts(@Parent() user: User): any[] {
    return (user.postsIds || []).map((id) => ({ __typename: 'Post', id }));
  }
}
