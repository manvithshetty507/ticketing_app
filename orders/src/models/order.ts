import { OrderStatus } from "@ms_tickets_app/common";
import mongoose from "mongoose";
import { TicketDoc } from './ticket';
// need three interface 
// 1. describe the properties on record
// 2. properties that a saved model has
// 3. overall collection properties

interface OrderAttrs {
    userId: string,
    status: string,
    expiresAt: Date,
    ticket: TicketDoc
}

interface OrderDoc extends mongoose.Document {
    userId: string,
    status: string,
    expiresAt: Date,
    ticket: TicketDoc
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs) : OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// 5. Add static method
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order, OrderStatus };