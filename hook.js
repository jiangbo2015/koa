const exec = require("child_process").execSync

module.exports = (req, res) => {
	exec("git pull && yarn")
	res.end("Welcome to Micro")
}
