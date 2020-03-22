// install with: npm install @octokit/webhooks
const WebhooksApi = require("@octokit/webhooks")
const exec = require("child_process").execSync

const webhooks = new WebhooksApi({
	secret: "koa"
})

webhooks.on("*", ({ id, name, payload }) => {
	let pullrestart = "git pull && yarn && pm2 restart koa-test"
	let pullrestartProd = "git pull && yarn && pm2 restart koa-prod"
	console.log(payload.ref, "ref")
	// master 分支
	try {
		if (payload.ref.includes("master")) {
			exec(`cd ../koa-prod && ${pullrestartProd}`)
		} else {
			exec(pullrestart)
		}
	} catch (err) {
		console.log(err)
	}
})

require("http")
	.createServer(webhooks.middleware)
	.listen(process.env.PORT)
