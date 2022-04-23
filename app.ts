import createError, { HttpError } from "http-errors";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";

import indexRouter from "./routes/index";
import apiRouter from "./routes/api";

const app = express();

app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/", indexRouter);
app.use("/api", apiRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
});

app.listen(process.env.PORT || 80);


