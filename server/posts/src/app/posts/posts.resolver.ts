import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver, ResolveReference,
} from '@nestjs/graphql';
import {ParseIntPipe, UseGuards} from '@nestjs/common';
import {AuthGuard, Roles} from "@project/models";
import { PostsService } from './posts.service';
import {Post} from "./post.model";
import {User} from "./user.model";
@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}
  @Query((returns) => Post)
  post(@Args({ name: 'id', type: () => ID }, ParseIntPipe) id: number): Post | undefined {
    return this.postsService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Roles(['USER'])
  @Query((returns) => [Post])
  posts(): Post[] {
    return this.postsService.findAll();
  }
  @ResolveReference()
  resolveReference(reference: { __typename: string; id: number }): Post | undefined {
    return this.postsService.findOne(reference.id);
  }
  @ResolveField((of) => User)
  user(@Parent() post: Post): any {
    return { __typename: 'User', id: post.authorId };
  }
}
