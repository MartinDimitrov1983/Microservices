import { Subjects } from './subject';

export interface ExpirationCompleteEvent {
    subject: Subjects.ExparationComplete;
    data: {
        orderId: string;
    };
}
