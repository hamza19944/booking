import express from "express"
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js"
import { createError } from "../utils/error.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

const createRoom = async (req, res, next) => {
    const hotelId = req.params.hotelid;
    const newRoom = new Room(req.body);

    try {
        const savedRoom = await newRoom.save();
        try {
            await Hotel.findByIdAndUpdate(hotelId, {$push: { rooms: savedRoom._id }})
        } catch (error) {
            next(error)
        }
        res.status(200).json(savedRoom)
    } catch (error) {
        next(error)
    }
}

// Update
const updateRoom = async (req, res, next) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, { $set: req.body}, { new: true}) // to back the new updated as it returns old-data by default
        res.status(200).json(updatedRoom)
    } catch (error) {
        next(error)
    }
}
// Delete
const deleteRoom = async (req, res, next) => {
    const hotelId = req.params.hotelid;

    try {
        await Room.findByIdAndDelete(req.params.id)
        try {
            await Hotel.findByIdAndUpdate(hotelId, {$pull: { rooms: savedRoom._id }})
        } catch (error) {
            next(error)
        }
        res.status(200).json("Room has been deleted")
    } catch (error) {
        next(error)
    }
}
// Get One
const getRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id)
        res.status(200).json(room)
    } catch (error) {
        next(error)
    }
}
// Get All
const getRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms)
    } catch (error) {
        next(error)
    }
}

// routes of up functions 
router.post("/:hotelid", verifyAdmin, createRoom)
router.put("/:id", verifyAdmin, updateRoom)
router.delete("/:id/:hotelid", verifyAdmin, deleteRoom)
router.get("/:id",  getRoom)
router.get("/", getRooms)

export default router;