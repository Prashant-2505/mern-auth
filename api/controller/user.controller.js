import User from '../models/user.model.js'
import { hashing } from '.././utils/hashingMiddleware.js'


export const updateUserController = async (req, res) => {
    if (req.user.id !== req.params.id) {
        console.log(req.params.id)
        console.log(req.user.id)
        return res.status(401).json("You can update only your account");
    }
    try {
        const existingUser = await User.findById(req.params.id);

        if (!existingUser) {
            return res.status(404).json("Invalid user");
        }

        if (req.body.password) {
            const hashedPassword = hashing(req.body.password);
            existingUser.password = hashedPassword;
        }
        if (req.body.profilePicture) {

            existingUser.profilePicture = req.body.profilePicture
        }

        existingUser.name = req.body.name;
        existingUser.email = req.body.email;

        const updatedUser = await existingUser.save();

        return res.status(200).json({
            success: true,
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                id: updatedUser._id,
                profilePicture: updatedUser.profilePicture
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json("Internal Server Error");
    }
};


export const deleteUserController = async (req, res) => {
    if (req.user.id !== req.params.id) {
        console.log(req.params.id)
        console.log(req.user.id)
        return res.status(401).json("You can update only your account");
    }
    try {
        const existingUser = await User.findByIdAndDelete(req.params.id);

        if (!existingUser) {
            return res.status(404).json("Invalid user");
        }
    
        return res.status(200).json({
            success: true,
            message:'user deleted successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json("Internal Server Error");
    }
};
