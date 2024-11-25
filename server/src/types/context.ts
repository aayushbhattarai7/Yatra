import { Request } from "express";

export interface Context {
  req: Request;
  user?: { id: string; email: string; role: string };
  files?: any;
}
