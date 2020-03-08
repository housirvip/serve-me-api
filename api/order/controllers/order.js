'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const OrderStatus = require('@core/order-status.js');

module.exports = {
  bid: async ctx => {
    const bid = ctx.request.body;
    bid.vendor = ctx.state.user.vendor.id;

    const res = await strapi.query('bid').create(bid);

    ctx.send(res);
  },
  accept: async ctx => {
    const bid = await strapi.query('bid').findOne(ctx.request.body);

    const order = {
      id: bid.order.id,
      vendor: bid.vendor.id,
      price: bid.price,
      status: OrderStatus.Accepting,
    };

    const res = await strapi.query('order').update({id: order.id, user: ctx.state.user.id}, order);

    ctx.send(res);
  },
  confirm: async ctx => {
    const order = ctx.request.body;
    order.status = OrderStatus.Pending;

    const res = await strapi.query('order').update({id: order.id, vendor: ctx.state.user.vendor.id}, order);

    ctx.send(res);
  },
  pay: async ctx => {
    const order = ctx.request.body;
    order.status = OrderStatus.Progressing;

    const res = await strapi.query('order').update({id: order.id, user: ctx.state.user.id}, order);

    ctx.send(res);
  },
  finish: async ctx => {
    const order = ctx.request.body;
    order.status = OrderStatus.Finished;

    const res = await strapi.query('order').update({id: order.id, vendor: ctx.state.user.vendor.id}, order);

    ctx.send(res);
  },
  complete: async ctx => {
    const order = ctx.request.body;
    order.status = OrderStatus.Completed;

    const res = await strapi.query('order').update({id: order.id, user: ctx.state.user.id}, order);

    ctx.send(res);
  },
};
