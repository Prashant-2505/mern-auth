import express from 'express'
import { deleteUserController, updateUserController} from '../controller/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.put('/update/:id',verifyToken,updateUserController)
router.delete('/delete/:id',verifyToken,deleteUserController)


export default router