import { body, validationResult } from 'express-validator';

import { tryCatchUtility } from '../../utils/errHandling/tryCatch.js';

export const validateDataUtility = tryCatchUtility(async(req, res, next) => {
    const apisRegexp = {
        signup:         /^\/signup$/,
        login:          /^\/login$/,
        forgetpass:     /^\/forgetpass$/,
        editprofile:    /^\/editprofile$/,
        setting:        /^\/setting$/
    };

    const { originalUrl:url, body:data } = req;
    const { login, signup, forgetpass, editprofile, setting } = apisRegexp;

    if(signup.test(url) || login.test(url) || editprofile.test(url) || setting.test(url))
        if(data.email) await body('email','').isEmail().normalizeEmail().run(req);

    if(signup.test(url) || login.test(url) || forgetpass.test(url))
        if(data.password) await body('password','').trim().isLength({ min: 8 }).isAlphanumeric().run(req);

    if(signup.test(url) || editprofile.test(url) || setting.test(url))
        if(data.username) await body('username','').trim().isLength({ min: 4, max: 20 }).isAlphanumeric().run(req);

    if(signup.test(url) || editprofile.test(url))
        if(data.phone) await body('phone','').trim().isMobilePhone().run(req);

    if(editprofile.test(url)) {
        if(data.aboutme) await body('aboutme','').trim().isString().isLength({ max: 250 }).run(req);
        if(data.address) await body('address','').trim().isString().isLength({ max: 70 }).run(req);
        if(data.facebook) await body('facebook','').trim().isString().isLength({ max: 15 }).run(req);
        if(data.instagram) await body('instagram','').trim().isString().isLength({ max: 15 }).run(req);
    }

    if(setting.test(url)) {
        if(data.newPass) await body('newPass','').trim().isLength({ min: 8, max: 20 }).isAlphanumeric().run(req);
        if(data.confirmPass) await body('confirmPass','').trim().isLength({ min: 8, max: 20 }).isAlphanumeric().run(req);
    }


    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    next();
});

