import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import datasource from "./utils";
import { buildSchema } from "type-graphql";
import { customAuthChecker } from "./auth";
import { UsersResolver } from "./resolvers/Users";
// import { PostsResolver } from "./resolvers/Posts";
// import { BlogsResolver} from "./resolvers/Blogs";
// import { CommentsResolver } from "./resolvers/Comments";
// import { PicturesResolver } from "./resolvers/Pictures";
// import { StripeResolver } from "./resolvers/Stripe";
// import { TransactionsResolver } from "./resolvers/Transactions";

const PORT = 5000;

async function bootstrap(): Promise<void> {
  // ... Building schema here
  const schema = await buildSchema({
    resolvers: [
      UsersResolver, 
    //   PostsResolver, 
    //   BlogsResolver, 
    //   CommentsResolver, 
    //   PicturesResolver, 
    //   StripeResolver,
    //   TransactionsResolver
    ],
    authChecker: customAuthChecker
  });

  // Create the GraphQL server
  const server = new ApolloServer({
    schema,
    cors: true,
    context: ({ req }) => {
      // get the user token from the headers
      const authorization = req.headers.authorization || '';
  
      if (authorization) {
        const token = authorization.split(' ').pop()
        // console.log('token', token)

        return { token }
      }

      return { token: null }
      // try to retrieve a user with the token
      // const user = getUser(token);
      // add the user to the context    
      // return { user };   
    },
  });

  // Start the server
  const { url } = await server.listen(PORT);
  console.log(`Server is running, GraphQL Playground available at ${url}`);

  try {
    await datasource.initialize();
    console.log("Server started!");
  } catch (err) {
    console.log("An error occured");
    console.error(err);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();