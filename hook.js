const exec = require("child_process").execSync
const send = require("micro").send
module.exports = (req, res) => {
	try {
		exec("git pull && yarn")
		console.log(
			`${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}: received push event`
		)
		res.end("success")
	} catch (err) {
		console.log(err)
		send(res, 500, "error")
	}
}
