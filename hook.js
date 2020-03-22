// install with: npm install @octokit/webhooks
const WebhooksApi = require("@octokit/webhooks")
const exec = require("child_process").execSync

const webhooks = new WebhooksApi({
	secret: "koa"
})

webhooks.on("*", ({ id, name, payload }) => {
	let koaTest = "git pull && yarn && pm2 restart koa-test"
	let crm = "cd ../mm-crm && git pull && yarn && pm2 restart crm"
	let miss = "cd ../mm-next && git pull && yarn && pm2 restart miss"
	let koaProd = "git pull && yarn && pm2 restart koa-prod"
	console.log(payload.ref, "ref")
	console.log(id, name)
	// master 分支
	try {
		if (payload.repository.name === "koa") {
			if (payload.ref.includes("master")) {
				exec(`cd ../koa-prod && ${koaProd}`)
			} else {
				exec(koaTest)
			}
		}
		if (payload.repository.name === "mm-crm") {
			if (payload.ref.includes("master")) {
				exec(crm)
			} else {
				exec(crm)
			}
		}
		if (payload.repository.name === "mm-next") {
			if (payload.ref.includes("master")) {
				exec(miss)
			} else {
				exec(miss)
			}
		}
	} catch (err) {
		console.log(err)
	}
})

require("http")
	.createServer(webhooks.middleware)
	.listen(process.env.PORT)
