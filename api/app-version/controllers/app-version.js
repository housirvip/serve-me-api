'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  check: async ctx => {
    const versions = await strapi.query('app-version').find({_sort: 'version:desc', _limit: 1});
    if (versions.length === 0) {
      ctx.send('<update></update>');
      return;
    }

    const res = '<update>' +
      '<version>' + versions[0].version + '</version>' +
      '<name>' + versions[0].name + '</name>' +
      '<url>' + versions[0].url + '</url>' +
      '</update>';

    ctx.send(res);
  }
};
