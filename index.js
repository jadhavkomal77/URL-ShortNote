const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { userProtected, adminProtected } = require("./middlewares/protected")
require("dotenv").config({ path: "./.env" })

// db
mongoose.connect(process.env.MONGO_URL)

const app = express()
//midddlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

//routes
app.use("/api/v1/auth", require("./routes/authRoute"))
app.use("/api/v1/url", require("./routes/urlRoutes"))
app.use("/api/v1/user", userProtected, require("./routes/userRoutes"))
app.use("/api/v1/admin", adminProtected, require("./routes/adminRoutes"))
//server start

//404
app.use("*", (req, res) => {
    res.status(404).json({ message: "Resource not found" })
})
// error handleer
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ message: err.message || "something went wrong" })

})

mongoose.connection.once("open", () => {
    console.log("MONGO CONNECTED")
    app.listen(process.env.PORT, console.log(`server running:http://localhost:${process.env.PORT}`))
})
