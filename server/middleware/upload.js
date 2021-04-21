const multer = require("multer")

// initialize multer parsing middleware
// => this tells multer to store received & parsed files in MEMORY (=RAM)
const upload = multer({ storage: multer.memoryStorage() })

module.exports = upload