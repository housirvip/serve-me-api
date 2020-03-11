'use strict';

const _ = require('lodash');

module.exports = async (ctx, next) => {
  ctx.query = {...ctx.query, user: ctx.state.user.id};
  ctx.params = {...ctx.params, user: ctx.state.user.id};
  // Go to next policy or will reach the controller's action.
  return await next();
};
