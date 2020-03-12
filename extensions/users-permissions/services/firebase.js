'use strict';

const admin = require('firebase-admin');

module.exports = {
  getUid: (token) => {
    return new Promise((resolve, reject) => {
      const parts = token.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw new Error('Invalid authorization header format. Format is Authorization: `Bearer ${token}`');
      }

      admin.auth().verifyIdToken(parts[1])
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
