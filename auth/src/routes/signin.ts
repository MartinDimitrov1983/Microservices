import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../middlewares/validateRequest';
import { BadRequestError } from '../errors/badRequestError';
import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post(
    '/api/user/signin',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('You must supply password'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const exisatingUser = await User.findOne({ email });

        if (!exisatingUser) {
            throw new BadRequestError('Invalid credentials');
        }

        const passwordMatch = await Password.compare(
            exisatingUser.password,
            password,
        );

        if (!passwordMatch) {
            throw new BadRequestError('Invalid credentials');
        }

        const userJwt = jwt.sign(
            {
                id: exisatingUser.id,
                email: exisatingUser.email,
            },
            process.env.JWT_KEY!,
        );

        req.session = {
            jwt: userJwt,
        };

        res.status(200).send(exisatingUser);
    },
);

export { router as signinRouter };
