import { Request } from "express";

export interface Context {
  body: any;
  req: Request;
  user?: { id: string; email: string; role: string };
  files?: any;
}
