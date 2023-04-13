const bcrypt = require("bcrypt")

module.exports.validatedUser = (user) => {
    const { username, password } = user
    if (!(password && username)) return false
    return { username, password }
}

module.exports.encryptUser = async (user) => {
    const encryptedUser = { ...user }
    encryptedUser.password = await bcrypt.hash(encryptedUser.password, 12)
    return encryptedUser
}

module.exports.comparePasswords = async (password, encryptedPassword) =>
    bcrypt.compare(password, encryptedPassword)