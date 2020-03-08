'use strict';

const admin = require('firebase-admin');

module.exports = {
  getUid: (ctx) => {
    return new Promise((resolve, reject) => {
      let token = '';

      if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
        const parts = ctx.request.header.authorization.split(' ');
        if (parts.length === 2) {
          const scheme = parts[0];
          const credentials = parts[1];
          if (/^Bearer$/i.test(scheme)) {
            token = credentials;
          }
        } else {
          throw new Error(
            'Invalid authorization header format. Format is Authorization: Bearer [token]'
          );
        }
      }

      admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {
          resolve(decodedToken.uid);
        }).catch(function (error) {
        reject(error);
      });
    });
  },
  tokenRefresh: uid => {
    return new Promise((resolve, reject) => {
      admin.auth().createCustomToken(uid)
        .then(function (customToken) {
          resolve(customToken);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
};
