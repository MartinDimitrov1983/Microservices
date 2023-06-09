import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TickedCreatedEvent } from '@mydimitickets/common';
import { TicketCreatedListener } from '../ticketCreatedListener';
import { natsWrapper } from '../../../natsWrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    //create an istance of listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    //create a fake data
    const data: TickedCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    };

    //creta e fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};

it('create and saves a ticket', async () => {
    const { listener, data, msg } = await setup();

    //call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    //write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.price).toEqual(data.title);
    expect(ticket!.title).toEqual(data.price);
});

it('acks the message', async () => {
    const {listener, data, msg} = await setup()

     //call the onMessage function with the data object + message object
     await listener.onMessage(data, msg);

     expect(msg.ack).toHaveBeenCalled()
});
