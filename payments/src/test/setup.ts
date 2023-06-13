import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    var signin: () => string[];
}

jest.mock('../natsWrapper');

process.env.STRIPE_KEY = 'sk_test_hnfrAm8rOkryFEnV23jjfFlw';

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasdf';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = () => {
    //Build a JWT Ppaload. { id , email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        emai: 'test@test.com',
    };

    //Create JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    //Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };

    //Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    //Take JSON and encode it as a base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    //retrun a string thats the cookie with encoded data
    return [`session=${base64}`];
};
