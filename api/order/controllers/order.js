'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  bid: async ctx => {
    const b = ctx.request.body;
    b.vendor = ctx.state.user.vendor.id;
    const bid = await strapi.query('bid').create(b);

    ctx.send(bid);
  },
  confirm: async ctx => {
    const bid = await strapi.query('bid').findOne(ctx.request.body);
    const order = await strapi.services.order.confirm(bid);

    ctx.send(order);
  },
};
