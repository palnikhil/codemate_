# codemate_
Video Link -https://drive.google.com/file/d/118TXgFYmpO_5Knu6_QtPg-qrQDfP6oSX/view?usp=sharing
# Summary:
The provided code sets up a Node.js server that acts as a GitHub App using the Octokit library. It listens for pull request events and performs actions based on the event type. If a pull request is opened and its title contains "/execute", the code uses the Piston library to execute the code provided in the pull request body using the JavaScript runtime. The output of the code execution is then posted as a comment on the pull request.

# Documentation:

**Dependencies**:

1. dotenv: A module for loading environment variables from a .env file.
2. octokit: A library for interacting with the GitHub API.
3. @octokit/webhooks: A library for handling GitHub webhook events.
4. fs: A core Node.js module for working with the file system.
5. http: A core Node.js module for creating an HTTP server.
6. piston-client: A library for executing code using different programming languages.


**Configuration**:
The code expects the following environment variables to be set in a .env file:

APP_ID: The ID of the GitHub App.
WEBHOOK_SECRET: The secret used to validate the webhook events.
PRIVATE_KEY_PATH: The path to the private key file for the GitHub App.

**Event Handling:**

The code defines an async function handlePullRequestOpened that is triggered when a pull request is opened.
If the pull request title contains "/execute", the code uses the Piston library to execute the JavaScript code provided in the pull request body.
The output of the code execution is stored in the messageForNewPRs variable.
The code then posts the messageForNewPRs as a comment on the pull request using the Octokit library.
Server Setup:

The code creates an instance of the Octokit App class, providing the app ID and private key.
It sets up the webhook event handling for the "pull_request.opened" event.
The server listens on the specified port and path, using the createNodeMiddleware function from the @octokit/webhooks library.
The server logs the webhook URL and waits for incoming events.

# Running the server
1. npm install octokit
2. npm install dotenv
3. npm install smee-client --save-dev
4. npm install piston-client
5. npm run server
