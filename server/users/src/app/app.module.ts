import { Module } from '@nestjs/common';
import {GraphQLModule, registerEnumType} from "@nestjs/graphql";
import {ApolloFederationDriver, ApolloFederationDriverConfig} from "@nestjs/apollo";
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import {JwtModule} from "@nestjs/jwt";
import {UserRoles} from "@project/models";
import {UsersResolver} from "./users/users.resolver";
import {UsersService} from "./users/users.service";
import {Post} from "./users/post.model";
registerEnumType(UserRoles, {
  name: 'UserRoles',
  description: 'User Roles',
});
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'mysecretworld',
      signOptions: { expiresIn: '3600s' },
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      fieldResolverEnhancers: ['guards'],
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
