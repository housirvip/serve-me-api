'use strict';

const ResponseBuilder = require('@core/reponse-builder');

module.exports = strapi => {
  return {
    initialize() {
      strapi.app.use(async (ctx, next) => {
        try {
          await next();
        } catch (e) {
          strapi.log.error(e);
          ctx.send(ResponseBuilder.error(e))
        }
      });
    },
  };
};
