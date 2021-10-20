import adModel from '../models/ad.js';

import { tryCatchUtility } from '../utils/errHandling/tryCatch.js';
import { generateErrUtility } from '../utils/errHandling/generateErr.js';

export const getAdsController = tryCatchUtility(async (req, res) => {
    let response;
    if(req.params.other === 'my') response = await adModel.find({ user_id: req.user.userid }).lean();
    else response = await adModel.find({ other: req.params.other }).lean();

    if(!response.length) throw new generateErrUtility('No ad found!',404);

    res.status(200).json({ ads: response });
});

export const postFreeAdController = tryCatchUtility(async (req, res) => {
    const newAd = JSON.parse(JSON.stringify(req.body));

    // checking if ad image added too, then adding it to ad body
    const { ad_image } = req.files || {};
    if(ad_image !== undefined) newAd.ad_image = ad_image[0].path.replace(/\\/g,'/');

    // converting string to array for fields 'features' & 'tag'
    if(newAd.features !== undefined) newAd.features = newAd.features.split(',');
    if(newAd.tag !== undefined) newAd.tag = newAd.tag.split(',');

    // adding user id into ad details
    newAd.user_id = req.user.userid;

    // saving new ad into ad model
    const response = await adModel.create(newAd);
    if(!response) throw new generateErrUtility('Something went wrong!\nPlease try again later...',500);

    res.status(201).json({
        msg: 'Ad posted successfully!',
        ad: response
    });
});

// export const resubmitAdController = tryCatchUtility(async (req, res) => {
// });

