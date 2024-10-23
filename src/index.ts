import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import datasource from "./utils";
import { buildSchema } from "type-graphql";
import { customAuthChecker } from "./auth";
import { UsersResolver } from "./resolvers/Users";
import { GarmentsResolver } from "./resolvers/Garments";
import { OutfitsResolver } from "./resolvers/Outfits";
import { OutfitsPlansResolver } from "./resolvers/OutfitsPlans";
import { v2 as cloudinary } from 'cloudinary';

const PORT = 5005;

async function bootstrap(): Promise<void> {
  // ... Building schema here
  const schema = await buildSchema({
    resolvers: [
      UsersResolver, 
      GarmentsResolver,
      OutfitsResolver,
      OutfitsPlansResolver
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

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
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

bootstrap();