import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@mydimitickets/common';
import { natsWrapper } from '../../../natsWrapper';
import { OrderCreatedListener } from '../orderCreatedListener';
import { Order } from '../../../models/order';

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    // //Create a order with order model
    // const order = Order.build({
    //     id: new mongoose.Types.ObjectId().toHexString(),
    //     status: OrderStatus.Created,
    //     userId: 'asdf',
    //     version: 0,
    //     price: 20,
    // });

    // await order.save();

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: 'asldkfj',
        userId: 'asdf',
        status: OrderStatus.Created,
        ticket: {
            id: 'asldkfj',
            price: 20,
        },
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { msg, data, listener };
};

it('replicates the order info and acks the message', async () => {
    const { msg, data, listener } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);
    expect(msg.ack).toHaveBeenCalled();
});
