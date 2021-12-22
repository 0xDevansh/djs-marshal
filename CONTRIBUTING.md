# Contributing to djs-marshal

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

#### The 'main' branch is dev, not master. Keep in mind when cloning the repo and submitting a PR

## Using git flow

I use the git flow workflow for this repository. I recommend you to do the same. You can read about it [here](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow#:~:text=The%20overall%20flow%20of%20Gitflow,branch%20is%20created%20from%20main&text=When%20a%20feature%20is%20complete%20it%20is%20merged%20into%20the,branch%20is%20created%20from%20main)

## Commit message format

We follow a fixed format for commit messages

[feat|keep|fix] (affected file or area) Change desc in short and present tense

**feat** stands for feature, use it when you have added some new features

**keep** stands for housekeeping, and should be used when the functioning of the code hasn't been changed, but it has been refactored, commented or linted.

**fix** stands for fix, use it when you fix some issue in the code

You can look at recent commits to see examples. Please don't commit a lot of changes at once, break it down into separate commits.

## Things to do before committing

- Take a look over the code you have added or changed. Make sure it is readable and properly commented.
- **run the lint script** before committing (`npm run lint` or `yarn lint`)
