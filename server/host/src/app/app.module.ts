import {IntrospectAndCompose} from "@apollo/gateway";
import {ApolloGatewayDriver, ApolloGatewayDriverConfig} from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import {GraphQLModule} from "@nestjs/graphql";
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        playground: true
      },
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'user', url: 'http://127.0.0.1:3001/graphql' },
            { name: 'post', url: 'http://127.0.0.1:3002/graphql' },
          ],
        }),
      },
    }),
  ],
})
export class AppModule {}
