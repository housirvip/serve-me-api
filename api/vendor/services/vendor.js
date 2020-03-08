'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  upgrade: async (u, v) => {
    const user = await strapi.plugins[
      'users-permissions'
      ].services.role.upgrade(u, 'vendor');

    if (user) {
      // user.vendor = vendor.id;
      v.user = user.id;
      u.vendor = await strapi.query('vendor').create(v);
    }

    return user;
  },
};
