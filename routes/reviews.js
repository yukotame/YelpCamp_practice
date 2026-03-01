import express from 'express';
import { catchAsync } from "../utils/catchAsync.js"
import ExpressError from '../utils/ExpressError.js';

import { reviewSchema } from '../schemas.js';
import { Campground } from "../models/campground.js";
import { Review } from "../models/review.js";
import { isLoggedIn ,validateReview, isReviewAuthor} from '../middleware.js';
import {createReview , deleteReview } from "../controllers/reviews.js";



//campgroundsのidがあることを明示する必要がある。
//app.js側で app.use('/campgrounds/:id/reviews', reviewRouter);を書くため。
const router = express.Router({mergeParams:true}); 


//review
//post  campgrounds/:id/reviews
router.post('/' , isLoggedIn, validateReview ,createReview )

router.delete('/:reviewId' , isLoggedIn, isReviewAuthor, )

export default router;