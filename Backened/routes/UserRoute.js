import express from "express"
import {loginUser,registerUser, verifyEmail} from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/verify",verifyEmail)

export  default userRouter;