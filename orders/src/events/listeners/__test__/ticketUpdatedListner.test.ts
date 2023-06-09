import mongoose, { set } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TickedUpdatedEvent } from '@mydimitickets/common';
import { TickedUpdatedListener } from '../ticketUpdatedListener';
import { natsWrapper } from '../../../natsWrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    //create an istance of listener
    const listener = new TickedUpdatedListener(natsWrapper.client);

    //create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });

    await ticket.save();

    //create a fake data
    const data: TickedUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'new concert',
        price: 999,
        userId: 'sadasdasd',
    };

    //creta e fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg, ticket };
};

it('find, update and saves a ticket', async () => {
    const { msg, data, ticket, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { msg, data, listener } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
    const { msg, data, listener } = await setup();

    data.version = 10;
    try {
        await listener.onMessage(data, msg);
    } catch (error) {}

    expect(msg.ack).not.toHaveBeenCalled();
});
