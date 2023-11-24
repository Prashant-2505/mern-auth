
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


// signinController
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


        const isPasswordValid = await comparePasswords(password, existingUser.password);

        if (isPasswordValid) {
            const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);

            res.cookie('access_token', token, { httpOnly: true }, { maxAge: 60 * 60 * 1000 })

            return res.status(200).json({
                message: "Login successful",
                success: true,
                user: {
                    name: existingUser.name,
                    email: existingUser.email,
                    id: existingUser._id,
                    profilePicture: existingUser.profilePicture
                }
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


// googleAuthController
export const googleController = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie('access_token', token, { httpOnly: true }, { maxAge: 60 * 60 * 1000 })

        return res.status(200).json({
            message: "Login successful",
            success: true,
            user: {
                name: user.name,
                email: user.email,
                id: user._id,
                profilePicture: user.profilePicture
            }
        });
    } else {
        const genratedPassword = Math.random().toString(36).slice(-8)
        const hashedPassword = hashing(genratedPassword);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            profilePicture: req.body.photo
        })
        await newUser.save();
    }
}


// signoutController
export const signoutController = async (req, res) => {
    res.clearCookie('access_token').status(200).json({
        success: true,
        message: 'sign out successfully'
    })
};


