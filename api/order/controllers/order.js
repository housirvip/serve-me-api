'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const OrderStatus = require('@core/order-status.js');
const ErrorMessages = require("@core/error-message");

module.exports = {
  bid: async ctx => {
    const bid = ctx.request.body;
    bid.vendor = ctx.state.user.vendor.id;

    const res = await strapi.query('bid').create(bid);

    ctx.send(res);
  },
  accept: async ctx => {
    const bid = await strapi.query('bid').findOne({id: ctx.request.body.id});

    const order = await strapi.query('order').findOne({id: bid.order.id});
    if (!order || order.user.id !== ctx.state.user.id || order.status !== OrderStatus.Biding) {
      throw new Error(ErrorMessages.ORDER_STATUS_FORBIDDEN)
    }

    const res = await strapi.query('order').update({id: order.id}, {
      vendor: bid.vendor.id,
      price: bid.price,
      status: OrderStatus.Accepting
    });

    ctx.send(res);
  },
  confirm: async ctx => {
    const order = await strapi.query('order').findOne({id: ctx.request.body.id});
    if (!order || order.vendor.id !== ctx.state.user.vendor.id || order.status !== OrderStatus.Accepting) {
      throw new Error(ErrorMessages.ORDER_STATUS_FORBIDDEN)
    }

    const res = await strapi.query('order').update({id: order.id}, {status: OrderStatus.Pending});

    ctx.send(res);
  },
  pay: async ctx => {
    const order = await strapi.query('order').findOne({id: ctx.request.body.id});
    if (!order || order.user.id !== ctx.state.user.id || order.status !== OrderStatus.Pending) {
      throw new Error(ErrorMessages.ORDER_STATUS_FORBIDDEN)
    }

    const res = await strapi.query('order').update({id: order.id}, {status: OrderStatus.Progressing});

    ctx.send(res);
  },
  finish: async ctx => {
    const order = await strapi.query('order').findOne({id: ctx.request.body.id});
    if (!order || order.vendor.id !== ctx.state.user.vendor.id || order.status !== OrderStatus.Progressing) {
      throw new Error(ErrorMessages.ORDER_STATUS_FORBIDDEN)
    }

    const res = await strapi.query('order').update({id: order.id}, {status: OrderStatus.Finished});

    ctx.send(res);
  },
  complete: async ctx => {
    const order = await strapi.query('order').findOne({id: ctx.request.body.id});
    if (!order || order.user.id !== ctx.state.user.id || order.status !== OrderStatus.Finished) {
      throw new Error(ErrorMessages.ORDER_STATUS_FORBIDDEN)
    }

    await strapi.query('review').create({
      ...ctx.request.body.review,
      order: order.id,
      vendor: order.vendor.id,
      user: ctx.state.user.id,
    });

    const res = await strapi.query('order').update({id: order.id}, {status: OrderStatus.Completed});

    ctx.send(res);
  },
};
