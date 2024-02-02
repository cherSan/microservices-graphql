import { Module } from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloFederationDriver, ApolloFederationDriverConfig} from "@nestjs/apollo";
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import {UsersResolver} from "./users/users.resolver";
import {UsersService} from "./users/users.service";
import {Post} from "./users/post.model";
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
        orphanedTypes: [Post],
      },
    }),
  ],
  providers: [UsersResolver, UsersService],
})
export class AppModule {}
