import { Router } from 'express';
import { signUpUser, signInUser, signUpTeacher, signOutUser } from '../../controllers/auth.controller';
import { createUserSchema, signInSchema } from '../../validation/user.validation';
import { createTeacherSchema } from '../../validation/teacher.validation';
import { validateData } from '../../middlewares/validation.middleware';
import { verifyToken } from '../../middlewares/auth.middleware';
import { limiter } from '../../middlewares/rateLimiter.middleware';



const router = Router();


router.post('/sign-up', validateData(createUserSchema), signUpUser);

router.post('/sign-in',limiter, validateData(signInSchema), signInUser);

router.post("/sign-out", verifyToken, signOutUser);

router.post('/teacher/sign-up', validateData(createTeacherSchema), signUpTeacher);

export default router;