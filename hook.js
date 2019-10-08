const exec = require("child_process").execSync

module.exports = (req, res) => {
	exec("git pull && yarn")
	console.log("receive post")
	res.end("Welcome to Mic")
}
