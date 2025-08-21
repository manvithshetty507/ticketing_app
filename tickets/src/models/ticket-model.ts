import mongoose from 'mongoose';

interface TicketAttrs {
    title: string,
    price: number,
    userId: string
}

interface TicketDocument extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
}

// this describes the properties that Ticket Model has
interface TicketModel extends mongoose.Model<TicketDocument> {
    build(attrs: TicketAttrs): TicketDocument;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
},
{
    toJSON: {
        transform(doc: any, ret: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
})

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

export const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', ticketSchema);