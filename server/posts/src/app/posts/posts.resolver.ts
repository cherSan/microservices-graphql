import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver, ResolveReference,
} from '@nestjs/graphql';
import {ParseIntPipe, UseGuards} from '@nestjs/common';
import {AuthGuard, Roles, UserRoles} from "@project/models";
import { PostsService } from './posts.service';
import {Post} from "./post.model";
import {User} from "./user.model";
@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}
  @UseGuards(AuthGuard)
  @Roles([UserRoles.USER])
  @Query((returns) => Post)
  post(@Args({ name: 'id', type: () => ID }, ParseIntPipe) id: number): Post | undefined {
    return this.postsService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Roles([UserRoles.USER])
  @Query((returns) => [Post])
  posts(): Post[] {
    return this.postsService.findAll();
  }
  @UseGuards(AuthGuard)
  @Roles([UserRoles.USER])
  @ResolveReference()
  resolveReference(reference: { __typename: string; id: number }): Post | undefined {
    return this.postsService.findOne(reference.id);
  }
  @UseGuards(AuthGuard)
  @Roles([UserRoles.USER])
  @ResolveField((of) => User)
  user(@Parent() post: Post): any {
    return { __typename: 'User', id: post.authorId };
  }
}
