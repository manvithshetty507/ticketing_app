import { OrderStatus } from "@ms_tickets_app/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
    id: string,
    version: number,
    userId: string,
    status: OrderStatus
    price: number
}

interface OrderDoc extends mongoose.Document {
    version: number,
    userId: string,
    status: OrderStatus
    price: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs) : OrderDoc;
    findByEvent(event: {id: string, version: number}) : Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus)
    }
}, {
    toJSON: {
        transform(doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        userId: attrs.userId,
        status: attrs.status,
        price: attrs.price
    })
}

orderSchema.statics.findByEvent = async (event: { id: string, version: number }) => {
    const order = await Order.findOne({
        _id: event.id,
        version: event.version - 1
    })
    return order;
}

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);