export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation((subject: string, data: string, callback: () => void) => {
      console.log(`[MOCK NATS] publish called: subject=${subject}, data=${data}`);
      callback();
    }),
  },
};