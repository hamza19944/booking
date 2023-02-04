import express from "express"
import User from "../models/User.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// Create 
const createUser = async (req, res, next) => {

    const newUser = new User(req.body)
    try {
        const savedUser = await newUser.save()
        res.status(200).json(savedUser)
    } catch (error) {
        next(error)
    }
}
// Update
const updateUser = async (req, res, next) => {
    try {
        const updatedUsers = await User.findByIdAndUpdate(req.params.id, { $set: req.body}, { new: true}) // to back the new updated as it returns old-data by default
        res.status(200).json(updatedUsers)
    } catch (error) {
        next(error)
    }
}
// Delete
const deleteUser  = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("Users has been deleted")
    } catch (error) {
        next(error)
    }
}
// Get One
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}
// Get All
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

// routes of up functions 
// router.get("/checkauthentication", verifyToken, (req, res, next) => {
//     res.send("You are logged in")
// })
// router.get("/checkuser/:id", verifyUser, (req, res, next) => {
//     res.send("You are logged in and have control")
// })
// router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
//     res.send("Hello Admin! You are logged in and have full control")
// })

router.post("/", createUser)
router.put("/:id", verifyUser,updateUser)
router.delete("/:id", verifyUser, deleteUser)
router.get("/:id", verifyUser, getUser)
router.get("/", verifyUser, getUsers)

export default router;