'use strict';

module.exports = async (ctx, next) => {
  if (!ctx.state.user) {
    // readonly fields
    delete ctx.request.body.user;
    delete ctx.params.user;
  } else {
    ctx.request.body.user = ctx.state.user.id;
    ctx.params.user = ctx.state.user.id;
  }
  // Go to next policy or will reach the controller's action.
  return await next();
};
