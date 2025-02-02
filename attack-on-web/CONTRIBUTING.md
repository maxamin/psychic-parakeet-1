### Contributing to AoW

Thanks for contributing to AoW! Make sure to Fork this repository into your account before making any commits. Then use the following commands to set up the project.

```jsx
git clone https://github.com/<your-github-username>/attack-on-web
cd attack-on-web
git remote add upstream https://github.com/felixfaisal/attack-on-web.git
npm install
```

Firstly, if you are afraid or unsure about anything, just ask or submit the issue or a pull request. You won't be yelled at for putting in your best effort. The worst that can happen is that you'll be politely asked to change something.

For a detailed guidance, read further.

All development happens on the develop branch. The main branch contains the known stable version of AOW. To make your contributions, create a new branch from develop.

```
git checkout develop
git checkout -b my-branch develop
```

### Committing your changes and creating a PR

Now you can make your changes, and commit them. We don't have any specific convention as of now, but try to have a clear and summarized message for your commits.

```jsx
git add .
git commit -m "My fixes"

```

Sync your forked repository with the changes in this(upstream) repository

```jsx
git fetch upstream
git rebase upstream/develop
```

Push the changes to your fork.

```jsx
git push origin my-branch
```

This is a good time, to open a pull request in this repository with the changes you have made. Make sure you open a pull request to merge to develop branch and not the main branch directly.

### How can I contribute?

**Reporting bugs:**

- Make sure you test against the latest version. There is a possibility that this bug has already been fixed.

**Report an issue here:**

- Use a descriptive title for the issue.
- Try to describe the steps to reproduce the problem that you are facing.
- Provide Examples and screenshots to demonstrate the steps if possible.

**Common Contribution Guidelines:**

- Make sure there is an issue reported, related to the work that you are doing.
- To prevent any duplication, comment under the issue.
- Push your commits and refer to the issue using fix `#<issue-no>` or close `#<issue-no>` in the commit message.
- Please don't make untested PRs.

**Commit Messages:**

- Write a short (50 chars or less) summary of changes.
- Optional body for a more detailed description of the change. Refer to [this](https://github.com/erlang/otp/wiki/writing-good-commit-messages) for a detailed overview.

**Credits:** Some parts of this are taken from: [PostgREST CONTRIBUTING.md](https://github.com/PostgREST/postgrest/blob/main/.github/CONTRIBUTING.md)
