import express from 'express';

import { settingApi, searchApi } from '../controllers/api.js';
import { validateDataUtility } from '../utils/validation/data.js';
import { validateTokenUtility } from '../utils/validation/token.js';

const router = express.Router();

export default router
    .put('/setting',validateTokenUtility,validateDataUtility,settingApi)
    .get('/search/:keyword',searchApi);

