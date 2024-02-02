import {Directive, Field, ID, InputType, Int, ObjectType} from '@nestjs/graphql';
import {Post} from "./post.model";
import {UserRoles} from "@project/models";
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
  @Field((type) => [UserRoles])
  roles?: UserRoles[];
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
