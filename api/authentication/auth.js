import bcrypt from "bcryptjs"
import User from "../models/User.js"
import {createError} from "../utils/error.js"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()
// REGISTER
export const register = async(req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash
        })

        await newUser.save()
        res.status(201).send("User has been created")
    } catch (error) {
        next(error)
    }
}
// LOGIN
export const login = async(req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username})
        if(!user) return next(createError(404, "User not found"))

        const isPassCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPassCorrect) return next(createError(400, "Wrong username or password"));

        const token = jwt.sign({id:user._id, isAdmin:user.isAdmin}, process.env.SECRET_KEY)

        const {password, isAdmin, ...otherDetails} = user._doc
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json({...otherDetails})
        console.log(req.cookies.access_token);
    } catch (error) {
        next(error)
    }
}