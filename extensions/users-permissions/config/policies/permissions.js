const _ = require('lodash');

module.exports = async (ctx, next) => {
  let role;

  if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
    let id = null;
    let isAdmin = false;
    let firebaseUid = null;

    try {
      firebaseUid = await strapi.plugins[
        'users-permissions'
        ].services.firebase.getUid(ctx);
    } catch (e) {
      try {
        const token = await strapi.plugins[
          'users-permissions'
          ].services.jwt.getToken(ctx);
        id = token.id;
        isAdmin = token.isAdmin;
      } catch (e) {
        return handleErrors(ctx, 'No valid Authorization Token', 'unauthorized');
      }
    }

    try {
      if (isAdmin) {
        ctx.state.admin = await strapi
          .query('administrator', 'admin')
          .findOne({id}, []);
      } else if (id) {
        ctx.state.user = await strapi
          .query('user', 'users-permissions')
          .findOne({id}, ['role']);
      } else if (firebaseUid) {
        ctx.state.user = await strapi
          .query('user', 'users-permissions')
          .findOne({firebaseUid}, ['role']);
      }
    } catch (err) {
      strapi.log.error(err);
      return handleErrors(ctx, err, 'unauthorized');
    }

    if (ctx.state.admin) {
      if (ctx.state.admin.blocked === true) {
        return handleErrors(ctx, 'Your account has been blocked by the administrator.', 'unauthorized');
      }

      ctx.state.user = ctx.state.admin;
      return await next();
    }

    if (!ctx.state.user) {
      return handleErrors(ctx, 'User Not Found', 'unauthorized');
    }

    role = ctx.state.user.role;

    if (role.type === 'root') {
      return await next();
    }

    const store = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    if (
      _.get(await store.get({key: 'advanced'}), 'email_confirmation') &&
      !ctx.state.user.confirmed
    ) {
      return handleErrors(
        ctx,
        'Your account email is not confirmed.',
        'unauthorized'
      );
    }

    if (ctx.state.user.blocked) {
      return handleErrors(
        ctx,
        'Your account has been blocked by the administrator.',
        'unauthorized'
      );
    }
  }

  // Retrieve `public` role.
  if (!role) {
    role = await strapi
      .query('role', 'users-permissions')
      .findOne({type: 'public'}, []);
  }

  const route = ctx.request.route;
  const permission = await strapi
    .query('permission', 'users-permissions')
    .findOne(
      {
        role: role.id,
        type: route.plugin || 'application',
        controller: route.controller,
        action: route.action,
        enabled: true,
      },
      []
    );

  if (!permission) {
    return handleErrors(ctx, undefined, 'forbidden');
  }

  // Execute the policies.
  if (permission.policy) {
    return await strapi.plugins['users-permissions'].config.policies[
      permission.policy
      ](ctx, next);
  }

  if (ctx.state.user && ctx.state.user.vendor) {
    ctx.state.user.vendor = await strapi
      .query('vendor')
      .findOne({id: ctx.state.user.vendor});
  }

  // Execute the action.
  await next();
};

const handleErrors = (ctx, err = undefined, type) => {
  throw strapi.errors[type](err);
};
