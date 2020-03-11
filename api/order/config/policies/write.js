'use strict';

module.exports = async (ctx, next) => {
  // readonly fields
  delete ctx.request.body.status;
  delete ctx.request.body.price;
  delete ctx.request.body.vendor;
  delete ctx.request.body.bids;
  delete ctx.request.body.review;
  ctx.request.body = {...ctx.request.body, user: ctx.state.user.id};
  ctx.params = {...ctx.params, user: ctx.state.user.id};
  // Go to next policy or will reach the controller's action.
  return await next();
};
