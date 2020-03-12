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
        let uid = ntf.vendor ? ntf.vendor.user.id : ntf.user.id;
        let tks = [];
        const tkList = await strapi.query("token").find({user: uid, _sort: "id:desc", _limit: 5});
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
        // console.log(res);
      });
    },
  };
};
