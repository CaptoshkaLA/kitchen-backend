
import express from "express";
import * as dotenv from "dotenv";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import helmet from "helmet";
import debug from "debug";
import cookieParser from "cookie-parser";
import * as bodyparser from "body-parser";
import { errorHandler } from "./middlewares/error.middleware";
import swaggerDocument from "../docs/swagger.json";

dotenv.config();

const port = process.env.PORT || 80;
const runningMessage = `Server running at http://localhost:${port}`;
const app: express.Application = express();
const debugLog: debug.IDebugger = debug("app");

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false;
}

app.use(errorHandler);
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
import routes from "./routes/routes";
app.use(routes);
app.use(expressWinston.logger(loggerOptions));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

app.listen(port, () => {
  debugLog(runningMessage);
});
