'use strict';

const admin = require('firebase-admin');
const NotifyStatus = require('@core/notify-status.js');

module.exports = strapi => {
  return {
    /**
     * Default options
     */

    defaults: {
      // config object
    },

    /**
     * Initialize the hook
     * listen the order-status event
     */
    initialize: async () => {
      // await someAsyncCode()
      // this().defaults['your_config'] to access to your configs.
      strapi.app.on("fcm-notify", async notification => {
        notification.status = NotifyStatus.Sending;
        const ntf = await strapi.query("notification").create(notification);
        let order = ntf.details;
        let uid = ntf.vendor ? order.vendor.user : order.user.id;
        let tks = [];
        const tkList = await strapi.query("token").find({user: 1, _sort: "id:desc", _limit: 1});
        tkList.forEach((tk) => {
          if (tk.webToken) {
            tks.push(tk.webToken);
          }
          if (tk.deviceToken) {
            tks.push(tk.deviceToken);
          }
        });
        const res = await admin.messaging().sendToDevice([...new Set(tks)],
          {
            notification: {
              title: ntf.title,
              body: ntf.content
            }
          });
        if (res.successCount) {
          await strapi.query("notification").update({id: ntf.id}, {status: NotifyStatus.Success});
        }
      });
    },
  };
};
