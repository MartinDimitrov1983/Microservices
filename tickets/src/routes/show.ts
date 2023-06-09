import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('api/ticket/:id', async (res: Response, req: Request) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw new Error('Ticket not found');
    }

    res.send(ticket);
});

export { router as showTicketRouter };
