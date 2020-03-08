'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  upgrade: async ctx => {
    const res = await strapi.services.vendor.upgrade(ctx.state.user, ctx.request.body);

    ctx.send(res);
  },
};
