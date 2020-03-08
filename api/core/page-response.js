class ResultResponse {
  code;
  result;
  message;
  total;

  constructor(result, total) {
    this.code = 0;
    this.result = result;
    this.message = null;
    this.total = total;
  }
}
