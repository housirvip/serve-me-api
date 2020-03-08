'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  refresh: async ctx => {
    const res = await strapi.plugins[
      'users-permissions'
      ].services.firebase.refreshToken(ctx.state.user.firebaseUid);

    ctx.send(res);
  },
};
