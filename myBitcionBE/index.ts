import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import { mainApp } from "./mainApp";
import { dbConfig } from "./utils/dbConfig";
dotenv.config();
import MongoDB from "connect-mongodb-session";

const MongoDBStore = MongoDB(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_DB_URL_ONLINE!,
  collection: "sessions",
});

const app: Application = express();
const portServer = process.env.PORT!;
const port = parseInt(portServer);

// Configure CORS
const corsOptions = {
  origin: "https://coin-x.online",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 24 * 60,
      sameSite: "lax",
      secure: false,
    },
    store,
  })
);

mainApp(app);

const server = app.listen(process.env.PORT || port, () => {
  console.clear();
  console.log(`Server running on port ${port}`);
  dbConfig();
});

process.on("uncaughtException", (error: Error) => {
  console.log("uncaughtException: ", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.log("unhandledRejection: ", reason);
  server.close(() => {
    process.exit(1);
  });
});
