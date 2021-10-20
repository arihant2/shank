import bcrypt from 'bcryptjs';

import userModel from '../models/user.js';

import { tryCatchUtility } from '../utils/errHandling/tryCatch.js';
import { generateErrUtility } from '../utils/errHandling/generateErr.js';

export const settingController = tryCatchUtility(async (req, res) => {
    const { user } = req;   // user extracted from token earlier

    // checking if email already exists
    if(req.body.email !== undefined) {
        const existingEmail = await userModel.findOne({ email: req.body.email, _id: { $nin: user.userid } }, { _id: 1 }).lean();
        if(existingEmail) throw new generateErrUtility('Email already exists!',409);
    }

    const updates = JSON.parse(JSON.stringify(req.body));

    // encrypting new password and adding it into updates body
    if(updates.newPass && updates.confirmPass) {
        if(updates.newPass === updates.confirmPass) {
            updates.password = await bcrypt.hash(updates.newPass, 10);       // encrypt password
            if(!updates.password) throw new generateErrUtility('Something went wrong!\nPlease try again later...',500);
        } else throw new generateErrUtility('Enter same password in both fields!',422);
    } else if((updates.newPass && !updates.confirmPass) || (!updates.newPass && updates.confirmPass)) {
        throw new generateErrUtility('Enter password in both fields!',422);
    }

    const response = await userModel.findByIdAndUpdate(user.userid, updates, { new: true }).lean();
    if(!response) throw new generateErrUtility('Unable to change setting!\nPlease try again later...',500);

    res.status(200).json({
        msg: 'Setting changed successfully!',
        changedSetting: response
    });
});

export const searchController = tryCatchUtility(async (req, res) => {

});

