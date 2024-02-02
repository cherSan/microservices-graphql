import {Directive, Field, ID, InputType, Int, ObjectType} from '@nestjs/graphql';
import {Post} from "./post.model";
@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field((type) => ID)
  id!: number;
  @Field()
  name!: string;
  @Field()
  login!: string;
  @Field()
  password!: string;
  @Field((type) => [Int])
  postsIds?: number[];
  @Field((type) => [String])
  roles?: string[];
  @Field((type) => [Post])
  posts?: Post[]
}

@InputType()
export class Auth {
  @Field()
  login!: string;
  @Field()
  password!: string;
}
