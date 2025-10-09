
export const stripe = {
    paymentIntents: {
        create: jest.fn().mockResolvedValue({id: 'test_id'})  
    }
};
