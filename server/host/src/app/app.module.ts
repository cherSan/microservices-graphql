import {IntrospectAndCompose, RemoteGraphQLDataSource} from "@apollo/gateway";
import {ApolloGatewayDriver, ApolloGatewayDriverConfig} from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import {GraphQLModule} from "@nestjs/graphql";
import {JwtModule} from "@nestjs/jwt";
import { verify, sign } from 'jsonwebtoken';
import {UserRoles} from "@project/models";
function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = (request.headers as any)['authorization']?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
const proxyHeaders = ({ req }: {req: Request}) => {
  const guestToken = sign({
    sid: -1,
    roles: [UserRoles.GUEST],
    name: 'Anonymous'
  }, 'mysecretworld', { expiresIn: '3600s' });
  const token = extractTokenFromHeader(req) || guestToken;
  return {
    ...req.headers,
    authorization: `Bearer ${verify(token, 'mysecretworld') ? token: guestToken }`
  };
}
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'mysecretworld',
      signOptions: { expiresIn: '3600s' },
    }),
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        context: proxyHeaders,
        playground: true
      },
      gateway: {
        buildService: ({ name, url }) => {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }: any) {
              request.http.headers.set('authorization', context.authorization);
            },
          });
        },
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
