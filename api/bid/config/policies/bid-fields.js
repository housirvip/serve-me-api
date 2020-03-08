'use strict';

module.exports = async (ctx, next) => {
  if (ctx.request.body) {
    // readonly fields
    ctx.request.body.vendor = ctx.state.user.vendor.id;
  }
  if (ctx.params) {
    ctx.params.vendor = ctx.state.user.vendor.id;
  }
  // Go to next policy or will reach the controller's action.
  return await next();
};
