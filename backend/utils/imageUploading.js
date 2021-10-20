import multer from 'multer';
import path from 'path';

import { generateErrUtility } from './errHandling/generateErr.js';

const fileFilter = (req, { mimetype }, cb) => {
    const validImg = /^image\/(jpg|jpeg|png|bmp|ico)$/;
    if(validImg.test(mimetype)) return cb(null, true);
    cb(new generateErrUtility('Allowed only JPG, JPEG, PNG, BMP, ICO formats!',422), false);
};

const storage = multer.diskStorage({
    destination: ({ url }, file, cb) => {
        // const validUrl = /^\/(add|update)product(\/[a-z0-9]{24})*$/;
        const validUrl = /^\/editprofile$/;
        cb(null, validUrl.test(url) ? './backend/images/profiles' : './backend/images/ads');
    },
    filename: (req, { originalname }, cb) => {
        const { name, ext } = path.parse(originalname);
        const chars = { ':': '-',  'T': '_T' };
        const newName = name
            .replace(/\s/g, '-') + '_' + new Date().toISOString()
            .replace(/[:T]/g, m => chars[m]) + ext;

        cb(null, newName);
    }
});

export const uploadConfig = multer({
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 512 },   // 512kb
    storage: storage
});
