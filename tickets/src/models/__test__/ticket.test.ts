import { Ticket } from '../ticket';

it('implements optimistic concurency control', async () => {
    const ticket = Ticket.build({
        userId: '123',
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    await firstInstance!.save();

    try {
        secondInstance!.save();
    } catch (error) {
        return;
    }

    throw new Error('Should not reach this point');
});

it('increment the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        userId: '123',
        title: 'concert',
        price: 20,
    });
    await ticket.save();
    expect(ticket.version).toEqual(0)
    await ticket.save();
    expect(ticket.version).toEqual(1)
    await ticket.save();
    expect(ticket.version).toEqual(2)
});
