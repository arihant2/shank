// auth
import { signupController, loginController, verifyEmailController, resetPassController } from './auth.js';

// profile
import { getProfileController, updateProfileController } from './profile.js';

// ad
import { getAdsController, postFreeAdController } from './ads.js';

// categories
import { getCategoriesController, getSubCategoriesController } from './categories.js';

// others
import { settingController, searchController } from './others.js';



// auth
export const signupApi = signupController;
export const loginApi = loginController;
export const verifyEmailApi = verifyEmailController;
export const resetPassApi = resetPassController;

// profile
export const getProfileApi = getProfileController;
export const updateProfileApi = updateProfileController;

// ad
export const getAdsApi = getAdsController;
export const postFreeAdApi = postFreeAdController;
// export const resubmitAdApi = resubmitAdController;

// categories
export const getCategoriesApi = getCategoriesController;
export const getSubCategoriesApi = getSubCategoriesController;

// others
export const settingApi = settingController;
export const searchApi = searchController;

