import { Publisher, Subjects, TickedUpdatedEvent } from '@mydimitickets/common';

export class TicketUpdatedPublisher extends Publisher<TickedUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
