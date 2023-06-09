import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

export { router as indexTicketRouter };

router.get('/api/tickets', async (req: Request, res: Response) => {
    const tickets = await Ticket.find({});

    res.send(tickets);
});
