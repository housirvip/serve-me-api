class ResultResponse {
  code;
  result;
  message;
  total;

  constructor(result) {
    this.code = 0;
    this.result = result;
    this.message = null;
    this.total = null;
  }
}
