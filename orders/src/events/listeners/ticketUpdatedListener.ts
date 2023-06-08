import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TickedUpdatedEvent } from '@mydimitickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queueGroupName';

export class TickedUpdatedListener extends Listener<TickedUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TickedUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        const { title, price } = data;
        ticket.set({ title, price });
        await ticket.save();

        msg.ack();
    }
}
