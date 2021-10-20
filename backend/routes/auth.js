import express from 'express';

import { signupApi, loginApi, forgetPassApi } from '../controllers/api.js';
import { validateDataUtility } from '../utils/validation/data.js';

const router = express.Router();

export default router
    .post('/signup', validateDataUtility,signupApi)
    .post('/login', validateDataUtility,loginApi)
    .patch('/forgetpass', validateDataUtility,forgetPassApi);

