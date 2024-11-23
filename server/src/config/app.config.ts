import express from "express";
import sanitizeHtml from "sanitize-html";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use((req, res, next) => {
  res.locals.sanitizeHtml = sanitizeHtml;
  next();
});
app.use(cors());
app.use(bodyParser.json());

export default app;
