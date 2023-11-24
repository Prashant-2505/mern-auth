import express from 'express'
import { signinController, signupController,googleController, signoutController } from '../controller/auth.controller.js'

const router = express.Router()

router.post('/signup', signupController)
router.post('/signin', signinController)
router.post('/google', googleController)
router.get('/signout', signoutController)


export default router