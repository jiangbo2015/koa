const exec = require("child_process").execSync
const { send } = require("micro")
module.exports = async (req, res) => {
	try {
		exec("git pull && yarn")
		// exec("cd ../koa-prod && git pull && yarn && pm2 restart hook")
		console.log(
			`${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}: received push event`
		)
		res.end("success")
	} catch (err) {
		console.log(err)
		send(res, 500, "error")
	}
}
