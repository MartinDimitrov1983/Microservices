import { Publisher, OrderCreatedEvent, Subjects } from '@mydimitickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
