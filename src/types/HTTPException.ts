import { StatusCode } from "status-code-enum";

export default class HTTPException extends Error {
  public readonly statusCode: StatusCode;
  constructor(statusCode: StatusCode, messsage: string) {
    super(messsage);
    this.statusCode = statusCode || 500;
  }
}
