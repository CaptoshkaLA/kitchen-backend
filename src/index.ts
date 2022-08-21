
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const port = process.env.PORT || 80;
const runningMessage = `Server running at http://localhost:${port}`;
const app: express.Application = express();

app.use(errorHandler);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
import routes from "./routes/routes";
app.use(routes);

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});
