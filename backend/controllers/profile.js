import userModel from '../models/user.js';

import { tryCatchUtility } from '../utils/errHandling/tryCatch.js';
import { generateErrUtility } from '../utils/errHandling/generateErr.js';

export const getProfileController = tryCatchUtility(async (req, res) => {
    const response = await userModel.findById(req.user.userid).lean();
    if(!response) throw new generateErrUtility('Profile not found!',404);
    res.status(200).json({ profile: response });
});

export const updateProfileController = tryCatchUtility(async (req, res) => {
    const { user } = req;   // user extracted from token earlier

    // checking if email already exists
    if(req.body.email !== undefined) {
        const existingEmail = await userModel.findOne({ email: req.body.email, _id: { $nin: user.userid } }, { _id: 1 }).lean();
        if(existingEmail) throw new generateErrUtility('Email already exists!',409);
    }

    const updates = JSON.parse(JSON.stringify(req.body));

    // checking if profile image added too, then adding it to profile body
    const { profile_image } = req.files || {};
    if(profile_image !== undefined)
        updates.profile_image = profile_image[0].path.replace(/\\/g,'/');

    const response = await userModel.findByIdAndUpdate(user.userid, updates, { new: true }).lean();
    if(!response) throw new generateErrUtility('Unable to update profile!\nPlease try again later...',500);

    res.status(200).json({
        msg: 'Profile updated successfully!',
        updatedProfile: response
    });
});

