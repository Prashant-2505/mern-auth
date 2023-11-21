
import e from 'express';
import User from '../models/user.model.js';
import { hashing } from '../utils/hashingMiddleware.js';
import { comparePasswords } from '../utils/hashingMiddleware.js';
import jwt from 'jsonwebtoken'


// signupController.js
export const signupController = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists, please login",
                success: false
            });
        }

        const hashedPassword = hashing(password);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();

        return res.status(201).json({
            message: "User created successfully",
            success: true,
        });
    } catch (error) {
        next(error);
    }
};





export const signinController = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Exclude the 'password' property from existingUser
        const { password: hashedPassword, ...rest } = existingUser._doc;

        const isPasswordValid = await comparePasswords(password, existingUser.password);

        if (isPasswordValid) {
            const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);

            res.cookie('access_token', token, { httpOnly: true }, { maxAge: 60 * 60 * 1000 })

            return res.status(200).json({
                message: "Login successful",
                success: true,
                existingUser: rest
            });
        } else {
            return res.status(401).json({
                message: "Email or password incorrect",
                success: false
            });
        }
    } catch (error) {
        next(error);
    }
};



