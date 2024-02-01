import { Module } from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloFederationDriver, ApolloFederationDriverConfig} from "@nestjs/apollo";
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import {PostsResolver} from "./posts/posts.resolver";
import {PostsService} from "./posts/posts.service";
import {User} from "./posts/user.model";
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2
      },
      playground: true,
      plugins: [ApolloServerPluginInlineTrace()],
      buildSchemaOptions: {
        orphanedTypes: [User],
      },
    }),
  ],
  providers: [PostsService, PostsResolver]
})
export class AppModule {}
