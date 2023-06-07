import { Subjects } from './subject';

export interface TickedCreatedEvent {
    subject: Subjects.TicketCreated;
    data: {
        id: string;
        version: string;
        title: string;
        price: number;
        userId: string;
    };
}
