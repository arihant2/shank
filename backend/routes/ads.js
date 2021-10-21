import express from 'express';

// import { getAdsApi, postFreeAdApi, resubmitAdApi } from '../controllers/api.js';
import { getAdsApi, postFreeAdApi } from '../controllers/api.js';
import { validateDataUtility } from '../utils/validation/data.js';
import { validateTokenUtility } from '../utils/validation/token.js';
import { uploadConfig } from '../utils/imageUploading.js';

const router = express.Router();

const uploadFields = [ { name: 'ad_image', maxCount: 1 } ];

export default router
    .get('/ads/:other(featured|favorite|my|pending|hidden|expired|published|resubmitted)',validateTokenUtility,getAdsApi)
    .post('/postfreead',uploadConfig.fields(uploadFields),validateTokenUtility,validateDataUtility,postFreeAdApi);
    // .put('/resubmitad',uploadConfig.fields(uploadFields),validateTokenUtility,validateDataUtility,resubmitAdApi);

