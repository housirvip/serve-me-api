'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const OrderStatus = require('@core/order-status.js');
const ErrorMessages = require("@core/error-message");

module.exports = {
  select: async ctx => {
    delete ctx.request.body.review;
    delete ctx.request.body.bids;
    const res = await strapi.query('order').create({
      ...ctx.request.body,
      status: OrderStatus.Accepting,
      user: ctx.state.user.id
    });

    ctx.app.emit('order-status', res);

    ctx.send(res);
  },
  deny: async ctx => {
    const order = await strapi.query('order').findOne({id: ctx.request.body.id});
    if (!order || order.vendor.id !== ctx.state.user.vendor.id) {
      throw new Error(ErrorMessages.ORDER_NOT_FOUND)
    } else if (order.status !== OrderStatus.Accepting) {
      throw new Error(ErrorMessages.ORDER_STATUS_FORBIDDEN)
    }

    const res = await strapi.query('order').update({id: order.id}, {status: OrderStatus.Denied});

    ctx.app.emit('order-status', res);

    ctx.send(res);
  },
  close: async ctx => {
    const order = await strapi.query('order').findOne({id: ctx.request.body.id});
    if (!order || order.user.id !== ctx.state.user.id) {
      throw new Error(ErrorMessages.ORDER_NOT_FOUND)
    } else if (order.status !== OrderStatus.Biding && order.status !== OrderStatus.Accepting && order.status !== OrderStatus.Pending) {
      throw new Error(ErrorMessages.ORDER_STATUS_FORBIDDEN)
    }

    const res = await strapi.query('order').update({id: order.id}, {status: OrderStatus.Closed});

    ctx.app.emit('order-status', res);

    ctx.send(res);
  },
  refund: async ctx => {
    const order = await strapi.query('order').findOne({id: ctx.request.body.id});
    if (!order || order.user.id !== ctx.state.user.id) {
      throw new Error(ErrorMessages.ORDER_NOT_FOUND)
    } else if (order.status !== OrderStatus.Progressing && order.status !== OrderStatus.Finished) {
      throw new Error(ErrorMessages.ORDER_STATUS_FORBIDDEN)
    }

    const res = await strapi.query('order').update({id: order.id}, {status: OrderStatus.Refunding});

    ctx.app.emit('order-status', res);

    ctx.send(res);
  },
  refundDeny: async ctx => {
    const order = await strapi.query('order').findOne({id: ctx.request.body.id});
    if (!order || order.vendor.id !== ctx.state.user.vendor.id) {
      throw new Error(ErrorMessages.ORDER_NOT_FOUND)
    } else if (order.status !== OrderStatus.Refunding) {
      throw new Error(ErrorMessages.ORDER_STATUS_FORBIDDEN)
    }

    const res = await strapi.query('order').update({id: order.id}, {status: OrderStatus.Progressing});

    ctx.app.emit('order-status', res);

    ctx.send(res);
  },
  refundAgree: async ctx => {
    const order = await strapi.query('order').findOne({id: ctx.request.body.id});
    if (!order || order.vendor.id !== ctx.state.user.vendor.id) {
      throw new Error(ErrorMessages.ORDER_NOT_FOUND)
    } else if (order.status !== OrderStatus.Refunding) {
      throw new Error(ErrorMessages.ORDER_STATUS_FORBIDDEN)
    }

    const res = await strapi.query('order').update({id: order.id}, {status: OrderStatus.Refunded});

    ctx.app.emit('order-status', res);

    ctx.send(res);
  },
  bid: async ctx => {
    const order = await strapi.query('order').findOne({id: ctx.request.body.order.id});
    if (!order) {
      throw new Error(ErrorMessages.ORDER_NOT_FOUND)
    } else if (order.status !== OrderStatus.Biding) {
      throw new Error(ErrorMessages.ORDER_STATUS_FORBIDDEN)
    }

    const res = await strapi.query('bid').create({...ctx.request.body, vendor: ctx.state.user.vendor.id});

    ctx.app.emit('order-status', {...order, bid: res});

    ctx.send(res);
  },
  accept: async ctx => {
    const bid = await strapi.query('bid').findOne({id: ctx.request.body.id});

    const order = await strapi.query('order').findOne({id: bid.order.id});
    if (!order || order.user.id !== ctx.state.user.id) {
      throw new Error(ErrorMessages.ORDER_NOT_FOUND)
    } else if (order.status !== OrderStatus.Biding) {
      throw new Error(ErrorMessages.ORDER_STATUS_FORBIDDEN)
    }

    const res = await strapi.query('order').update({id: order.id}, {
      vendor: bid.vendor.id,
      price: bid.price,
      status: OrderStatus.Accepting
    });

    ctx.app.emit('order-status', res);

    ctx.send(res);
  },
  confirm: async ctx => {
    const order = await strapi.query('order').findOne({id: ctx.request.body.id});
    if (!order || order.vendor.id !== ctx.state.user.vendor.id) {
      throw new Error(ErrorMessages.ORDER_NOT_FOUND)
    } else if (order.status !== OrderStatus.Accepting) {
      throw new Error(ErrorMessages.ORDER_STATUS_FORBIDDEN)
    }

    const res = await strapi.query('order').update({id: order.id}, {status: OrderStatus.Pending});

    ctx.app.emit('order-status', res);

    ctx.send(res);
  },
  pay: async ctx => {
    const order = await strapi.query('order').findOne({id: ctx.request.body.id});
    if (!order || order.user.id !== ctx.state.user.id) {
      throw new Error(ErrorMessages.ORDER_NOT_FOUND)
    } else if (order.status !== OrderStatus.Pending) {
      throw new Error(ErrorMessages.ORDER_STATUS_FORBIDDEN)
    }

    const res = await strapi.query('order').update({id: order.id}, {status: OrderStatus.Progressing});

    ctx.app.emit('order-status', res);

    ctx.send(res);
  },
  finish: async ctx => {
    const order = await strapi.query('order').findOne({id: ctx.request.body.id});
    if (!order || order.vendor.id !== ctx.state.user.vendor.id) {
      throw new Error(ErrorMessages.ORDER_NOT_FOUND)
    } else if (order.status !== OrderStatus.Progressing) {
      throw new Error(ErrorMessages.ORDER_STATUS_FORBIDDEN)
    }

    const res = await strapi.query('order').update({id: order.id}, {status: OrderStatus.Finished});

    ctx.app.emit('order-status', res);

    ctx.send(res);
  },
  complete: async ctx => {
    const order = await strapi.query('order').findOne({id: ctx.request.body.id});
    if (!order || order.user.id !== ctx.state.user.id) {
      throw new Error(ErrorMessages.ORDER_NOT_FOUND)
    } else if (order.status !== OrderStatus.Finished) {
      throw new Error(ErrorMessages.ORDER_STATUS_FORBIDDEN)
    }

    await strapi.query('review').create({
      ...ctx.request.body.review,
      order: order.id,
      vendor: order.vendor.id,
      user: ctx.state.user.id,
    });

    const res = await strapi.query('order').update({id: order.id}, {status: OrderStatus.Completed});

    ctx.app.emit('order-status', res);

    ctx.send(res);
  },
  incomes: async ctx => {
    const orders = await strapi.query('order').find({vendor: ctx.state.user.vendor.id, status: OrderStatus.Completed});

    let res = 0;
    orders.forEach(order => {
      res += order.price;
    });

    ctx.send({res});
  }
};
