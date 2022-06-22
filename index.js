const core = require('@actions/core');
const github = require('@actions/github');

async function run () {
    try {
        // `who-to-greet` input defined in action metadata file
        const nameToGreet = core.getInput('who-to-greet');
        console.log(`Hello ${nameToGreet}!`);
        const time = (new Date()).toTimeString();
        core.setOutput("time", time);
        // Get the JSON webhook payload for the event that triggered the workflow
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`);
        // This should be a token with access to your repository scoped in as a secret.
        // The YML workflow will need to set myToken with the GitHub Secret Token
        // myToken: ${{ secrets.GITHUB_TOKEN }}
        // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
        const myToken = core.getInput('GITHUB_TOKEN');

        const octokit = github.getOctokit(myToken)

        // You can also pass in additional options as a second parameter to getOctokit
        // const octokit = github.getOctokit(myToken, {userAgent: "MyActionVersion1"});

        const { data: pullRequest } = await octokit.rest.pulls.get({
            ...github.context.repo,
            //owner: github.context.payload.base.repo.owner.login,
            //repo: github.context.payload.base.repo.name,
            pull_number: github.context.payload.number,
        });

        console.log(`The pullRequest Payload: ${pullRequest}`);
      } catch (error) {
        core.setFailed(error.message);
      }
}

run()
