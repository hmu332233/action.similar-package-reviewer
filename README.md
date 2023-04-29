# action.compare-dependencies

A GitHub Action that provides a summary of similar packages detected by analyzing pull requests for new dependencies, effectively streamlining dependency management and preventing redundancy in Node.js projects, powered by ChatGPT

![summary](https://user-images.githubusercontent.com/10302969/235314378-35cf7ba3-89b4-4279-8b0c-959ac46ecfc4.png)

## How it works

1. When a PR is created, the action checks for any newly installed packages.
2. If there are newly installed packages, they are compared to the previously installed packages.
3. A summary is generated to identify any similar packages detected during the comparison.
4. The summary is presented as a GitHub Action job summary.
5. The action output allows you to receive the results in other ways, such as incorporating them into other GitHub workflows or displaying them as a PR comment.

## Usage

Add a new YAML workflow to your .github/workflows folder:

```yaml
name: 'Check Dependencies'

on:
  pull_request:
    types: [opened]

jobs:
  compare:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: Compare packages
        id: compare-packages
        uses: hmu332233/action.compare-dependencies@v0.1.1
        with:
          openai_key: ${{ secrets.OPENAI_API_KEY }}
```

If you want, you can get a PR comment through output

```yaml
name: 'Check Dependencies And Create Comment'

on:
  pull_request:
    types: [opened]

jobs:
  compare:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: Compare packages
        id: compare-packages
        uses: hmu332233/action.compare-dependencies@v0.1.1
        with:
          openai_key: ${{ secrets.OPENAI_API_KEY }}
      - name: Create comment
        uses: peter-evans/create-or-update-comment@v3
        with:
          issue-number: ${{ github.event.pull_request.number }}
          body: |
            ${{ steps.compare-packages.outputs.results }}
```

## Prerequisites

Before using action.compare-dependencies, you need to have an OpenAI API key. If you don't have an API key yet, you can get one by signing up on the [OpenAI website](https://platform.openai.com/account/api-keys).

## Inputs

| Name            | Description                                                                                                                                    | Default     | Required |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------- |
| `openai_key`    | openai api key                                                                                                                                 |             | Yes      |
| `origin_branch` | The branch to be used as the base for comparison, typically the main branch of the project. Can be customized if needed.                       | origin/main | No       |
| `target_branch` | The branch associated with the pull request, which contains the changes to be compared against the origin branch. Can be customized if needed. | [PR BRANCH] | No       |

## Outputs

| Name      | Description                                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `results` | A summary of any similar packages detected during the comparison, intended to be posted as a comment on the pull request for review and consideration. |

## Contributing

Welcome contributions to action.compare-dependencies!

<!-- Please see our CONTRIBUTING.md file for more information on how to contribute. -->

## License

action.compare-dependencies is released under the MIT. See [LICENSE](./LICENSE) for more details.
