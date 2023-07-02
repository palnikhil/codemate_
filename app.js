import dotenv from "dotenv";
import {App} from "octokit";
import {createNodeMiddleware} from "@octokit/webhooks";
import fs from "fs";
import http from "http";
import piston from "piston-client";

dotenv.config();

const appId = process.env.APP_ID;
const webhookSecret = process.env.WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;

const privateKey = fs.readFileSync(privateKeyPath, "utf8");

const app = new App({
    appId: appId,
    privateKey: privateKey,
    webhooks: {
      secret: webhookSecret
    },
  });


async function handlePullRequestOpened({octokit, payload}) {
    let messageForNewPRs = "New PR";
    console.log(`Received a pull request event for #${payload.pull_request.number}`);
    //console.log(payload)
    // try{
    //     const res = await octokit.request("GET /repos/{owner}/{repo}/commits/{sha}", {
    //         owner: payload.repository.owner.login,
    //         repo: payload.repository.name,
    //         sha: payload.pull_request.head.sha,
    //         headers: {
    //           "x-github-api-version": "2022-11-28",
    //         },
    //     });
    //     console.log(res.body)
    //     const data = JSON.parse(res.body);
    //     const files = data.files;
    //     const codeContents = {};
    //     for (const file of files) {
    //       const filename = file.filename;
    //       const content = file.content;
    //       codeContents[filename] = content;
    //     }
    //     console.log(codeContents)
    // }
    // catch (error) {
    //       if (error.response) {
    //         console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
    //       }
    //       console.error(error)
    // }
    let title = String(payload.pull_request.title)
    console.log(title)
    if(title.includes('/execute'))
    {
        const client = piston();
        const result = await client.execute('javascript', payload.pull_request.body, { language: '3.9.4 '});
        console.log(result.run.output)
        const output = result.run.output;
        messageForNewPRs = output   
    }
    try {
      let comment = await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.pull_request.number,
        body: messageForNewPRs,
        headers: {
          "x-github-api-version": "2022-11-28",
        },
      });
      console.log(comment);
    } catch (error) {
      if (error.response) {
        console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
      }
      console.error(error)
    }
};

app.webhooks.on("pull_request.opened", handlePullRequestOpened);
app.webhooks.onError((error) => {
    if (error.name === "AggregateError") {
      console.error(`Error processing request: ${error.event}`);
    } else {
      console.error(error);
    }
  });
const port = 3000;
const host = 'localhost';
const path = "/api/webhook";
const localWebhookUrl = `http://${host}:${port}${path}`;
const middleware = createNodeMiddleware(app.webhooks, {path});
http.createServer(middleware).listen(port, () => {
    console.log(`Server is listening for events at: ${localWebhookUrl}`);
    console.log('Press Ctrl + C to quit.')
  });
  