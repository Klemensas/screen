import * as express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import { mergeDeep } from 'apollo-utilities';
import { buildContext } from 'graphql-passport';
import * as cors from 'cors';

import { typeDefs as watchedTypeDefs } from '../models/watched/typeDefs';
import { resolvers as watchedResolvers } from '../models/watched/resolvers';
import { typeDefs as userTypeDefs } from '../models/user/typeDefs';
import { resolvers as userResolvers } from '../models/user/resolvers';
import { typeDefs as movieTypeDefs } from '../models/movie/typeDefs';
import { resolvers as movieResolvers } from '../models/movie/resolvers';
import { typeDefs as tvTypeDefs } from '../models/tv/typeDefs';
import { resolvers as tvResolvers } from '../models/tv/resolvers';
import { typeDefs as seasonTypeDefs } from '../models/season/typeDefs';
import { resolvers as seasonResolvers } from '../models/season/resolvers';
import { typeDefs as episodeTypeDefs } from '../models/episode/typeDefs';
import { resolvers as episodeResolvers } from '../models/episode/resolvers';
import { typeDefs as ratingTypeDefs } from '../models/rating/typeDefs';
import { typeDefs as reviewTypeDefs } from '../models/review/typeDefs';
import reviewResolvers from '../models/review/resolvers';
import { typeDefs as autoTrackedTypeDefs } from '../models/autoTracked/typeDefs';
import autoTrackedResolvers from '../models/autoTracked/resolvers';

import { Auth } from '../auth/auth';
import { baseType, serviceTypeDefs } from './typeDefs';
import { serviceResolvers } from './resolvers';
import { config } from '../config';

export function initializeApolloServer(app: express.Express) {
  const apolloServer = new ApolloServer({
    introspection: true,
    typeDefs: [
      baseType,
      movieTypeDefs,
      tvTypeDefs,
      seasonTypeDefs,
      episodeTypeDefs,
      watchedTypeDefs,
      userTypeDefs,
      serviceTypeDefs,
      ratingTypeDefs,
      reviewTypeDefs,
      autoTrackedTypeDefs,
    ],
    // TODO: mergeDeep is apollo internal method, investigate use of array. Alternative solution is using makeExecutableSchema
    resolvers: mergeDeep(
      watchedResolvers,
      userResolvers,
      serviceResolvers,
      movieResolvers,
      tvResolvers,
      seasonResolvers,
      episodeResolvers,
      reviewResolvers,
      autoTrackedResolvers,
    ),
    context: ({ req, res }) => buildContext({ req, res }),
    // context: async ({ req, res }) => {
    //   if (req) {
    //     let user;

    //     if (req.headers.authorization) {
    //       const token =
    //         req.headers.authorization.indexOf('Bearer ') === 0
    //           ? req.headers.authorization.slice(7)
    //           : null;
    //       try {
    //         user = await Auth.getUserFromToken(token);
    //       } catch (err) {
    //         throw new AuthenticationError('Invalid token. Sign in again.');
    //       }
    //     }

    //     return {
    //       user,
    //       login: req.login,
    //     };
    //   }
    // },
    tracing: config.env !== 'production',
    playground: {
      settings: {
        'request.credentials': 'same-origin',
      },
    },
  });

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });
  return apolloServer;
}
