import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@mydimitickets/common';
import { natsWrapper } from '../../../natsWrapper';
import { OrderCancelledListener } from '../orderCancelledListener';
import { Order } from '../../../models/order';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    //Create a order with order model
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: 'asdf',
        version: 0,
        price: 20,
    });

    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 0,
        ticket: {
            id: 'asldkfj',
        },
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { msg, data, listener, order };
};

it('updates the status of the order', async () => {
    const { msg, data, order, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    expect(msg.ack).toHaveBeenCalled();
});
