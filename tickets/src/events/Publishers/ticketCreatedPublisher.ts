import { Publisher, TickedCreatedEvent, Subjects } from '@mydimitickets/common';

export class TickedCreatedPublsher extends Publisher<TickedCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
