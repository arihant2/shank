import categoryModel from '../models/category.js';

import { tryCatchUtility } from '../utils/errHandling/tryCatch.js';
import { generateErrUtility } from '../utils/errHandling/generateErr.js';

export const getCategoriesController = tryCatchUtility(async (req, res) => {
    const response = await categoryModel.find().select('category').lean();
    if(!response.length) throw new generateErrUtility('No category found!',404);
    res.status(200).json({ categories: response });
});

export const getSubCategoriesController = tryCatchUtility(async (req, res) => {
    const response = await categoryModel.findById(req.params.cid).select('subCategories -_id').lean();
    if(!response) throw new generateErrUtility('No sub category found!',404);
    // res.status(200).send(`subCategories: ${response.subCategories}`);
    res.status(200).json({ subCategories: response.subCategories });

});

