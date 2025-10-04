export enum OrderStatus {
    // when a order made, and that ticket is not reserved already
    Created = 'created',
    // when order is deliberately cancelled or ticket already reserved or order expires
    Cancelled = 'cancelled',
    // order is reserved successfully
    AwaitingPayment = 'awaiting:payment',
    //provided payment
    Completed = 'completed'
}