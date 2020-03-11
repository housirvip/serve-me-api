'use strict';

module.exports = async (ctx, next) => {
  ctx.request.body = {...ctx.request.body, vendor: ctx.state.user.vendor.id};
  ctx.params = {...ctx.params, vendor: ctx.state.user.vendor.id};
  // Go to next policy or will reach the controller's action.
  return await next();
};
