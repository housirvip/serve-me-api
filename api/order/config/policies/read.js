'use strict';

const OrderStatus = require('@core/order-status.js');

module.exports = async (ctx, next) => {
  // only biding can be read by public
  if (ctx.query.status === OrderStatus.Biding) {
    return await next();
  }

  if (ctx.params.vendor) {
    ctx.params = {...ctx.params, vendor: ctx.state.user.vendor.id};
  } else {
    ctx.params = {...ctx.params, user: ctx.state.user.id};
  }

  if (ctx.query.vendor) {
    ctx.query = {...ctx.query, vendor: ctx.state.user.vendor.id};
  } else {
    ctx.query = {...ctx.query, user: ctx.state.user.id};
  }

  // Go to next policy or will reach the controller's action.
  return await next();
};
