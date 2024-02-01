import {Directive, Field, ID, Int, ObjectType} from '@nestjs/graphql';
import {Post} from "./post.model";
@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field((type) => ID)
  id!: number;
  @Field()
  name!: string;
  @Field((type) => [Int])
  postsIds?: number[];
  @Field((type) => [Post])
  posts?: Post[]
}
