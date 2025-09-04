export default class CustomError extends Error {
  statusCode: number;
<<<<<<< HEAD
  data?: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);        
    this.statusCode = statusCode; 
    this.data = data;     

    Object.setPrototypeOf(this, CustomError.prototype);
=======
  data: any;

  constructor(message: string, statusCode: number, data: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;

   Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
>>>>>>> 6e53c6292180d3478127d3733465dc4d2be3c437
  }
}
