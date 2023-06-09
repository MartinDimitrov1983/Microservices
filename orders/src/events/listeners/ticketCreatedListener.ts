import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TickedCreatedEvent } from '@mydimitickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queueGroupName';

export class TicketCreatedListener extends Listener<TickedCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TickedCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data;

        const ticket = Ticket.build({
            id,
            title,
            price,
        });

        await ticket.save();

        msg.ack();
    }
}
