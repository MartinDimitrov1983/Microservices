import {
    Subjects,
    Publisher,
    ExpirationCompleteEvent,
} from '@mydimitickets/common';

export class ExpirationCompletPublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExparationComplete = Subjects.ExparationComplete;
}
