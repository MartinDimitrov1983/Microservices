import { Subjects } from './subject';

export interface TickedUpdatedEvent {
    subject: Subjects.TicketUpdated;
    data: {
        id: string;
        version: string;
        title: string;
        price: number;
        userId: string;
        orderId?:string;
    };
}
