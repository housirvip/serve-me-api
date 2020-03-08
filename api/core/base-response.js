class BaseResponse {
  code;
  result;
  message;
  total;

  constructor(code, result, message, total) {
    this.code = code;
    this.result = result;
    this.message = message;
    this.total = total;
  }
}
