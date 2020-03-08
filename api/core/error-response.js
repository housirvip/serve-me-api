class ErrorResponse {
  code;
  result;
  message;
  total;

  constructor(message) {
    this.code = 1;
    this.result = null;
    this.message = message;
    this.total = null;
  }
}
