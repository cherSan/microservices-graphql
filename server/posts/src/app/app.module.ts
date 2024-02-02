import { Module } from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloFederationDriver, ApolloFederationDriverConfig} from "@nestjs/apollo";
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import {PostsResolver} from "./posts/posts.resolver";
import {PostsService} from "./posts/posts.service";
import {User} from "./posts/user.model";
import {JwtModule} from "@nestjs/jwt";
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'mysecretworld',
      signOptions: { expiresIn: '3600s' },
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2
      },
      playground: true,
      context: ({ req }: any) => ({ req }),
      plugins: [ApolloServerPluginInlineTrace()],
      buildSchemaOptions: {
        orphanedTypes: [User],
      },
    }),
  ],
  providers: [PostsService, PostsResolver]
})
export class AppModule {}
