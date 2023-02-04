import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import hotelsRoute from "./routes/hotels.js";
import usersRoute from "./routes/users.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser"

dotenv.config()

const app = express();
app.use(express.json())
const connect = async () => {
    try {
        await mongoose.connect(process.env.DBURL)
    } catch (error) {
        if(error) console.log(error)
    }
}
mongoose.connection.on("disconnected", () => {
    console.log("DBMongoose disconnected");
})

// middlewares
app.use(cookieParser())
app.use("/api/auth", authRoute)
app.use("/api/users", usersRoute)
app.use("/api/hotels", hotelsRoute)
app.use("/api/rooms", roomsRoute)

// adding error handling middleware
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Hello error from handler"
    return res.status(errorStatus).json({
        sucess: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
})

app.listen(3000, () => {
    connect();
    console.log("connected to backend");
})