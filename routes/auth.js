const express = require("express")
const jwt = require("jsonwebtoken");
const { validatedUser, encryptUser, comparePasswords } = require("../utils/user");
const User = require("../models/userModel")
const authRouter = express.Router()

authRouter.post("/register", async (req, res) => {
    try {
        const validatedUserData = validatedUser(req.body)
        const encryptedUser = await encryptUser(validatedUserData)
        const createdUser = await User.create(encryptedUser)
        res.send(createdUser)
    } catch (error) {
        res.status(400).send(String(error))
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const validatedUserData = validatedUser(req.body)
        if (!validatedUserData) return res.sendStatus(400)

        const user = await User.findOne({ username: validatedUserData.username })
        if (!user) return res.status(400).send("User couldn't be found")

        const isPasswordCorrect = await comparePasswords(validatedUserData.password, user.password)
        if (!isPasswordCorrect) return res.status(400).send("Wrong credentials")

        const accessToken = jwt.sign(user.username, process.env.ACCESS_TOKEN_SECRET)
        res.json({ accessToken, user })
    } catch (error) {
        res.status(400).send(error)
    }
})

authRouter.get("/user", async (req, res) => {
    const { authorization } = req.headers
    if (!authorization) return res.send(null)

    const token = authorization.split(" ")[1]

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, username) => {
        if (err) return res.send(null)
        else {
            const user = await User.findOne({ username })
            res.send(user)
        }
    })

})

module.exports = authRouter