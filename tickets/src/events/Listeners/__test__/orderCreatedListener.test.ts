import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@mydimitickets/common';
import { natsWrapper } from '../../../natsWrapper';
import { OrderCreatedListener } from '../orderCreatedListener';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const orderId = new mongoose.Types.ObjectId().toHexString();

    //Create a ticket with ticket model
    const ticket = Ticket.build({
        userId: 'asdf',
        title: 'concert',
        price: 20,
    });

    await ticket.save();

    const data: OrderCreatedEvent['data'] = {
        id: orderId,
        version: 0,
        status: OrderStatus.Created,
        userId: 'alskdfi',
        expiresAt: 'alskdfi',
        ticket: {
            id: ticket.id,
            price: ticket.price,
        },
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { msg, data, ticket, orderId, listener };
};

it('sets the userId of the ticket', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

it('publish a ticket updated event', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1],
    );

    expect(data.id).toEqual(ticketUpdatedData.orderId);
});
