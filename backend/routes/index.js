import express from 'express';

import authRoute from './auth.js';
// import adsRoute from './ads.js';

// import { validateTokenUtility } from '../utils/validation/token.js';
// import { validateUserUtility } from '../utils/validation/user.js';

import { generateErrUtility } from '../utils/errHandling/generateErr.js';
import { printErrUtility } from '../utils/errHandling/printErr.js';


const router = express.Router();

// router.get(/^\/(home)*$/,validateTokenUtility,validateUserUtility);
router.get(/^\/(home)*$/, (req,res) =>
    res.status(200).send('<br><h1><center>Hi there! ✋<br><br>Welcome to the Shank World..</center></h1>')
);

router.use('/',authRoute);

// router.use('/',adsRoute);










// for invalid urls
router.all('*', req => {
    throw new generateErrUtility(`Requested url: [${req.method}] ${req.headers.host + req.originalUrl} doesn't exist!`,404); // directly passing err to global err handler & printer written below, without using 'next(err)'
});

// express err handler, global err format for printing user defined errs
router.use(printErrUtility);

export default router;

