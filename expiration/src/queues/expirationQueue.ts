import Queue from 'bull';
import { ExpirationCompletPublisher } from '../events/Publishers/ExpirationCompletePublisher';
import { natsWrapper } from '../natsWrapper';

interface Payload {
    orderId: string;
}

const exparatationQueue = new Queue<Payload>('order: expiration', {
    redis: {
        host: process.env.REDIS_HOST,
    },
});

exparatationQueue.process(async (job) => {
    new ExpirationCompletPublisher(natsWrapper.client).publish({
        orderId: job.data.orderId,
    });
});

export { exparatationQueue };
