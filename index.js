const core = require('@actions/core');
const github = require('@actions/github');

const RELEASE_TYPE_SKIP = 'skip'
const RELEASE_TYPE_PATCH = 'patch'
const RELEASE_TYPE_MINOR = 'minor'
const RELEASE_TYPE_MAJOR = 'major'

function getReleaseType (labels) {
    if (labels.indexOf('skip-release') >= 0) {
        return RELEASE_TYPE_SKIP
    }
    if (labels.indexOf('dev') >= 0 && labels.indexOf('dependencies') >= 0) {
        return RELEASE_TYPE_PATCH
    }
    if (labels.indexOf('major') >= 0) {
        return RELEASE_TYPE_MAJOR
    }
    if (labels.indexOf('minor') >= 0) {
        return RELEASE_TYPE_MINOR
    }
    return RELEASE_TYPE_PATCH
}

async function run () {
    try {
        // Get the JSON webhook payload for the event that triggered the workflow
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`)
        // This should be a token with access to your repository scoped in as a secret.
        // The YML workflow will need to set myToken with the GitHub Secret Token
        // myToken: ${{ secrets.GITHUB_TOKEN }}
        // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
        const myToken = core.getInput('GITHUB_TOKEN')
        const octokit = github.getOctokit(myToken)
        const { data: pullRequest } = await octokit.rest.pulls.get({
            ...github.context.repo,
            pull_number: github.context.payload.number,
        })
        // console.log(`The pullRequest Payload: ${JSON.stringify(pullRequest, undefined, 2)}`)
        // console.log(`The pullRequest.labels Payload: ${JSON.stringify(pullRequest.labels, undefined, 2)}`)
        const labels = pullRequest.labels.map((label) => label.name)
        core.setOutput('releaseType', getReleaseType(labels))
      } catch (error) {
        core.setFailed(error.message);
      }
}

run()
