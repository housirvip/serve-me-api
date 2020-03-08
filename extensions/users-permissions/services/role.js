'use strict';

module.exports = {
  upgrade: async (user, type) => {
    if (user.role.type === type) {
      return null;
    }

    const role = await strapi.query('role', 'users-permissions')
      .findOne({type: type}, []);

    return await strapi
      .query('user', 'users-permissions')
      .update({id: user.id}, {role});
  }
};
