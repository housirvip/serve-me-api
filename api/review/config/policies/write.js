'use strict';

module.exports = async (ctx, next) => {
  delete ctx.request.body.order;
  delete ctx.request.body.vendor;
  ctx.request.body = {...ctx.request.body, user: ctx.state.user.id};
  ctx.params = {...ctx.params, user: ctx.state.user.id};
  // Go to next policy or will reach the controller's action.
  return await next();
};
