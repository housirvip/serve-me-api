'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  upgrade: async ctx => {
    const user = ctx.state.user;
    const vendor = ctx.request.body;
    
    const res = await strapi.services.vendor.upgrade(user, vendor);

    ctx.send(res);
  },
};
