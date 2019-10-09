const exec = require("child_process").execSync
const { send, json } = require("micro")
module.exports = async (req, res) => {
	try {
		const data = await json(res)
		console.log(data)
		console.log(data.body, data.event)
		exec("git pull && yarn")
		// exec("cd ../koa-prod && git pull && yarn")
		console.log(
			`${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}: received push event`
		)
		res.end("success")
	} catch (err) {
		console.log(err)
		send(res, 500, "error")
	}
}
