import express from 'express';

import { getCategoriesApi, getSubCategoriesApi } from '../controllers/api.js';

const router = express.Router();

export default router
    .get('/categories',getCategoriesApi)
    .get('/subcategories/:cid',getSubCategoriesApi);

