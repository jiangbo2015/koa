// install with: npm install @octokit/webhooks
const WebhooksApi = require("@octokit/webhooks")
const webhooks = new WebhooksApi({
	secret: "koa"
})

webhooks.on("*", ({ id, name, payload }) => {
	console.log(id, name, payload)
	console.log("event received")
})

require("http")
	.createServer(webhooks.middleware)
	.listen(4000)
// can now receive webhook events at port 4000
