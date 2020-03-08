'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  confirm: async b => {
    const order = b.order;
    order.vendor = b.vendor.id;
    order.price = b.price;
    order.status = OrderStatus.Accepting;
    return await strapi.query('order').update(order);
  },
};
