import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@mydimitickets/common';
import { Ticket } from '../models/ticket';
import { TickedCreatedPublsher } from '../events/Publishers/ticketCreatedPublisher';
import { natsWrapper } from '../natsWrapper';

const router = express.Router();

router.post(
    'api/tickets',
    requireAuth,
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id,
        });

        await ticket.save();

        new TickedCreatedPublsher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: title.price,
            userId: ticket.userId,
            version: ticket.version,
        });

        res.status(201).send(ticket)
    },
);

export { router as createTicketRouter };
