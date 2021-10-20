import express from 'express';

import { getProfileApi, updateProfileApi } from '../controllers/api.js';
import { validateDataUtility } from '../utils/validation/data.js';
import { validateTokenUtility } from '../utils/validation/token.js';
import { uploadConfig } from '../utils/imageUploading.js';

const router = express.Router();

const uploadFields = [ { name: 'profile_image', maxCount: 1 } ];

export default router
    .get('/profile',validateTokenUtility,getProfileApi)
    .put('/editprofile',uploadConfig.fields(uploadFields),validateTokenUtility,validateDataUtility,updateProfileApi);

