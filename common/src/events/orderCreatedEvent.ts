import { Subjects } from './subject';
import { OrderStatus } from './types/orderStatus';

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        id: string;
        version: string;
        status: OrderStatus;
        userId: string;
        expiresAt: string;
        ticket: {
            id: string;
            price: number;
        };
    };
}
