// for actions to be performed by authenticated users only (basically after logging in)

import jwt from "jsonwebtoken";

import { key } from "../../controllers/auth.js";

import { generateErrUtility } from '../../utils/errHandling/generateErr.js';

export const validateTokenUtility = (req, res, next) => {   // check token validity
    const { headers:{ authorization }, originalUrl:url } = req;
    if(authorization === undefined)
        // throw new generateErrUtility('Unauthorized!',401);
        return res.status(401).send('Unauthorized');
        // return next();

    const token = authorization.split(' ')[1];
    jwt.verify(token, key, (err, user) => {
        if(err) throw new generateErrUtility('Forbidden!',403);
        req.user = user;     // 'req.' adds data in it and use to send that data to next middleware
    });
    next();
};

