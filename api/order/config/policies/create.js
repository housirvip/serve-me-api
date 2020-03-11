'use strict';

const OrderStatus = require('@core/order-status.js');

module.exports = async (ctx, next) => {
  // readonly fields
  ctx.request.body.status = OrderStatus.Biding;
  // Go to next policy or will reach the controller's action.
  return await next();
};
