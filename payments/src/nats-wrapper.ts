import nats, { Stan } from 'node-nats-streaming'

class NatsWrapper {

    private _client?: Stan;

    get client() {
        if(!this._client) {
            throw new Error('Cannot access client before connect')
        }
        return this._client;
    }
    connect(clusterId: string, clientId: string, url: string) {
        // Create connection and assign to _client
        this._client = nats.connect(clusterId, clientId, { url });

        return new Promise<void>((resolve, reject) => {
            if (this._client) {
                this._client.on('connect', () => {
                    console.log('Connected to NATS-----');
                    resolve();
                })

                this._client.on('error', (err) => {
                    reject(err);
                })
            } else {
                reject(new Error('Failed to initialize NATS client.'));
            }
        })
    }
}

export const natsWrapper = new NatsWrapper();
