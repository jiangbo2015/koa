// install with: npm install @octokit/webhooks
const WebhooksApi = require("@octokit/webhooks");
const exec = require("child_process").execSync;

const webhooks = new WebhooksApi({
  secret: "koa"
});

webhooks.on("*", ({ id, name, payload }) => {
  let koaTest = "cd /home/koa-dev && git pull && yarn && pm2 restart koa-test";
  let koaProd = "cd /home/koa-prod && git pull && yarn && pm2 restart koa-production";
  let crmTest =
    "cd /home/mm-crm && git pull && yarn && yarn build-test && pm2 restart crm";
  let crmProd =
    "cd /home/crm-prod && git pull && yarn && yarn build-prod && pm2 restart crm-prod";
  console.log(payload.ref, "ref");
  console.log(id, name);
  // master 分支
  try {
    if (payload.repository.name === "koa") {
      if (payload.ref.includes("master")) {
        exec(koaProd);
      } else {
        exec(koaTest);
      }
    }
    if (payload.repository.name === "mm-crm") {
      if (payload.ref.includes("master")) {
        exec(crmProd);
      } else {
        exec(crmTest);
      }
    }
    
  } catch (err) {
    console.log(err);
  }
});

require("http")
  .createServer(webhooks.middleware)
  .listen(process.env.PORT);
