'use strict';

const OrderStatus = require('@core/order-status.js');
const NotifyType = require('@core/notify-type.js');

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
      strapi.app.on("order-status", async order => {
        // console.log(order);
        let msg = "";
        let vendor = null;
        let user = null;
        switch (order.status) {
          case OrderStatus.Waiting:
            // depressed
            break;
          case OrderStatus.Biding:
            // tell the customer, order get one more bid
            msg = "get a new bid, price is " + order.bid.price;
            user = order.user.id;
            break;
          case OrderStatus.Accepting:
            // tell the vendor, his/her bid was accepted, wait him/her to confirm
            msg = "your bid was accepted, please confirm the order";
            vendor = order.vendor.id;
            break;
          case OrderStatus.Progressing:
            // tell the customer, the order was paid and go to progressing
            msg = "your order was paid by customer, please check the order";
            user = order.user.id;
            break;
          case OrderStatus.Finished:
            // tell the customer, the order was finished, wait him/her to give a review
            msg = "your order was finished by vendor, please check the order";
            user = order.user.id;
            break;
          case OrderStatus.Completed:
            // tell the vendor, the order was completed
            msg = "your order was completed, please check the order";
            vendor = order.vendor.id;
            break;
          case OrderStatus.Pending:
            // tell the customer, the order is waiting to make a payment
            msg = "your order was confirmed, please pay for the order";
            user = order.user.id;
            break;
          case OrderStatus.Refunding:
            // tell the vendor, the order from the customer need refund
            msg = "the customer request a refund, please pay for the order";
            vendor = order.vendor.id;
            break;
          case OrderStatus.Refunded:
            // tell the customer, the order was refunded successfully
            msg = "the order was refunded successfully, please pay for the order";
            user = order.user.id;
            break;
          case OrderStatus.Closed:
            // tell the vendor, the order was closed
            msg = "the order was closed by customer, please pay for the order";
            vendor = order.vendor.id;
            break;
          case OrderStatus.Denied:
            // tell the customer, the order refund was denied
            msg = "the refund request by vendor, please pay for the order";
            user = order.user.id;
            break;
          default:
        }
        // told fcm-notify hook to send the notification
        strapi.app.emit("fcm-notify", {
          type: NotifyType.OrderStatus,
          title: "Order Status Changed",
          content: "Your order: " + order.title + ", " + msg,
          user: user,
          vendor: vendor,
          details: order,
        });
      });
    },
  };
};
