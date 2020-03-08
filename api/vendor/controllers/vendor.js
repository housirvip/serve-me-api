'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const UserRole = require('@core/user-role.js');

module.exports = {
  upgrade: async ctx => {
    const vendor = ctx.request.body;

    const user = await strapi.plugins[
      'users-permissions'
      ].services.role.upgrade(ctx.state.user, UserRole.Vendor);

    vendor.user = user.id;

    const res = await strapi.query('vendor').create(vendor);

    ctx.send(res);
  },
};
