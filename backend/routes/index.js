import express from 'express';

import authRoute from './auth.js';
import profileRoute from './profile.js';
import adsRoute from './ads.js';
import categoriesRoute from './categories.js';
import othersRoute from './others.js';

// import { validateTokenUtility } from '../utils/validation/token.js';
// import { validateUserUtility } from '../utils/validation/user.js';

import { generateErrUtility } from '../utils/errHandling/generateErr.js';
import { printErrUtility } from '../utils/errHandling/printErr.js';


const router = express.Router();

// router.get(/^\/(home)*$/,validateTokenUtility,validateUserUtility);
router.get(/^\/(home)*$/, (_,res) =>
    res.status(200).send('<br><center><h1>Hi there! ✋<br><br>Welcome to the Shank World..</h1></center>')
);

router.use('/',authRoute);

router.use('/',profileRoute);

router.use('/',adsRoute);

router.use('/',categoriesRoute);

router.use('/',othersRoute);










// for invalid urls
router.all('*', req => {
    throw new generateErrUtility(`Requested url: [${req.method}] ${req.headers.host + req.originalUrl} doesn't exist!`,404); // directly passing err to global err handler & printer written below, without using 'next(err)'
});

// express err handler, global err format for printing user defined errs
router.use(printErrUtility);

export default router;

