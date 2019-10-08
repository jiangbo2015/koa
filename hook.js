const exec = require("child_process").execSync

module.exports = (req, res) => {
	exec("git pull && yarn")
	console.log("receive post, change some things")
	res.end("Welcome to Micro")
}
