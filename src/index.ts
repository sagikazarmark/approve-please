import { Probot } from "probot";

const grantedStampUrl = 'https://static.wikia.nocookie.net/papersplease/images/6/69/Green_stamp.png/revision/latest?cb=20210509111351';
const grantedBody = `![Granted](${grantedStampUrl})`;

const deniedStampUrl = 'https://static.wikia.nocookie.net/papersplease/images/d/d7/Red_stamp.png/revision/latest?cb=20210509111049';
const deniedBody = `![Denied](${deniedStampUrl})`;

const defaultConfig = {
  praise: true,
  authorOnly: true,
};

export default (app: Probot) => {
  app.on("issue_comment.created", async (context) => {
    if (context.payload.issue.state == "closed") {
      context.log.debug("comment was not made on an open issue or pull request; ignoring");

      return
    }

    if (context.payload.issue.pull_request == null) {
      context.log.debug("comment was not made on a pull request; ignoring");

      return
    }

    if (context.payload.comment == null) {
      context.log.debug("no comment was made; ignoring");

      return
    }

    const config = await context.config("preapprove.yaml", defaultConfig);

    // context.log.debug(context.payload)

    const command = context.payload.comment.body?.match(/^\/([\w]+)\b *(.*)?$/m);

    if (command == null) {
      context.log.debug("no command");

      return
    }

    // Bot is engaged at this point, so praise Arstotzka
    if (config?.praise) {
      const comment = context.issue({
        body: "**Glory to Arstotzka!**",
      });
      await context.octokit.issues.createComment(comment);
    }

    if (config?.authorOnly && context.payload.issue.user.id !== context.payload.comment.user.id) {
      context.log.debug("comment was not made by the author; ignoring");

      const review = context.pullRequest({
        event: 'COMMENT' as const,
        body: denyWithCitation('Only the author of the pull request can request approval.'),
      });
      await context.octokit.pulls.createReview(review);

      return
    }

    const review = context.pullRequest({
      event: 'APPROVE' as const,
      body: grantedBody,
    });

    await context.octokit.pulls.createReview(review);
  });
};

function denyWithCitation(violation: string): string {
  return `${deniedBody}

${citation(violation)}
`;
}

function citation(violation: string): string {
  return `<details>
<summary><b>Citation</b></summary><br>

Protocol Violated.

${violation}

</details>
`;
}
