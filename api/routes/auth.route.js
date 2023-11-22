import express from 'express'
import { signinController, signupController,googleController } from '../controller/auth.controller.js'

const router = express.Router()

router.post('/signup', signupController)
router.post('/signin', signinController)
router.post('/google', googleController)


export default router