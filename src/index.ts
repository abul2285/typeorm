import "reflect-metadata";
import "node-fetch";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";
const isEmail = require("isemail");

import { SpaceResolver } from "./resolvers/SpaceResolver";
import { createConnection } from "typeorm";
import { LaunchAPI } from "./datasources/launch";
import { userAPI } from "./datasources/user";
import { User } from "./entity/User";
// import { User } from "./entity/User";

(async () => {
  const app = express();
  app.use(cookieParser());
  app.get("/", (_req, res) => {
    res.send("hello from server");
  });
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [SpaceResolver]
      //   scalarsMap: [{ type: ObjectID, scalar: ObjectIdScalar }]
    }),
    dataSources: () => {
      return {
        launchAPI: new LaunchAPI(),
        userAPI: new userAPI()
      };
    },
    context: async ({ req }) => {
      // simple auth check on every request
      const auth = (req.headers && req.headers.authorization) || "";
      const email = Buffer.from(auth, "base64").toString("ascii");
      if (!isEmail.validate(email)) return { user: null };
      // find a user by their email
      const user = await User.findOne({ where: { email } });
      console.log(user);
      if (!user) return null;

      return { user };
    }
  });
  await createConnection();
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log("server is running");
  });
})();
