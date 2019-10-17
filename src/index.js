import express from 'express';
import { connect as connectMongo } from './mongo/Mongo';
import requestController from './RequestController';
import responseController from './ResponseController';

import authController from './security/AuthController';
import usersController from './users/UsersController';
import peopleController from './people/PeopleController';

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(requestController);

app.use(authController);
app.use(usersController);
app.use(peopleController);

app.use(responseController);

init();

async function init() {
    try {
        await connectMongo();
        app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));
    } catch (e) {
        finishWithError(e);
    }
}

function finishWithError(error) {
    console.error('Error', error);
    process.exit(1);
}