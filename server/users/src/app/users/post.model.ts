import {Directive, Field, ID, Int, ObjectType} from '@nestjs/graphql';
@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class Post {
  @Field((type) => ID)
  @Directive('@external')
  id: number;
}
