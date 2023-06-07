import { Subjects } from './subject';

export interface ExparationCompleteEvent {
    subject: Subjects.ExparationComplete;
    data: {
        orderId: string;
    };
}
