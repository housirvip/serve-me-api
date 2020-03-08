module.exports = {
  error: err => {
    return {
      code: 1,
      message: err.message
    }
  }
};
