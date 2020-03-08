'use strict';

module.exports = async (ctx, next) => {
  if (!ctx.state.user){
    delete ctx.request.body.user;
    delete ctx.params.user;
    // Go to next policy or will reach the controller's action.
    return await next();
  }
  if (ctx.request.body) {
    // readonly fields
    ctx.request.body.user = ctx.state.user.id;
  }
  if (ctx.params) {
    ctx.params.user = ctx.state.user.id;
  }
  // Go to next policy or will reach the controller's action.
  return await next();
};
