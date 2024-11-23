import { createServer } from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { AppDataSource } from "./config/database.config";
import app from "./config/app.config";
import bodyParser from "body-parser";
import cors from "cors";

const typeDefs = `
  type Query {
    hello: String!
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello, world!",
  },
};

async function listen() {
  const PORT = process.env.PORT || 4000;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  app.use(cors());
  app.use(bodyParser.json());
  app.use("/graphql", expressMiddleware(server));

  const httpServer = createServer(app);
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

AppDataSource.initialize()
  .then(async () => {
    console.log("🚀 ~ Database Connected Successfully:");
    await listen();
  })
  .catch((err) => {
    console.log(`🚀 ~ Database Failed to connect: ${err?.message}`);
  });
