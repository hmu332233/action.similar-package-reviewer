# action.similar-package-reviewer

A GitHub Action that provides a summary of similar packages detected by analyzing pull requests for new dependencies, effectively streamlining dependency management and preventing redundancy in Node.js projects, powered by ChatGPT

![summary](https://user-images.githubusercontent.com/10302969/235314378-35cf7ba3-89b4-4279-8b0c-959ac46ecfc4.png)

## Key Features

- 🧩 Automatically checks for newly installed packages in pull requests
- 🔍 Compares new packages to previously installed packages
- 📊 Generates a summary of similar packages detected during the comparison
- 🚀 Integrates seamlessly into GitHub Actions workflows and presents the summary as a job output
- ✨ Easily incorporate the results into other GitHub workflows or display them as a PR comment

To get started, simply add a new YAML workflow to your .github/workflows folder, and follow the Usage section in README.

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
        uses: hmu332233/action.similar-package-reviewer@v1.0.1
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
        uses: hmu332233/action.similar-package-reviewer@v1.0.1
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

Before using action.similar-package-reviewer, you need to have an OpenAI API key. If you don't have an API key yet, you can get one by signing up on the [OpenAI website](https://platform.openai.com/account/api-keys).

## Inputs

## Inputs

| Name               | Description                                                                                                                                                               | Default                       | Required |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | -------- |
| `openai_key`       | openai api key                                                                                                                                                            |                               | Yes      |
| `origin_branch`    | The branch to be used as the base for comparison, typically the main branch of the project. Can be customized if needed.                                                  | origin/${{ github.base_ref }} | No       |
| `target_branch`    | The branch associated with the pull request, which contains the changes to be compared against the origin branch. Can be customized if needed.                            | origin/${{ github.head_ref }} | No       |
| `model`            | Specifies the ChatGPT model to be used for analyzing pull requests. Different models may provide varying levels of analysis accuracy and performance.                     | gpt-3.5-turbo                 | No       |
| `use_functioncall` | Indicates whether to use the functioncall feature of ChatGPT. Using functioncall can provide more stable execution but may produce slightly different comparison results. | false                         | No       |

## Outputs

| Name      | Description                                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `results` | A summary of any similar packages detected during the comparison, intended to be posted as a comment on the pull request for review and consideration. |

## Contributing

Welcome contributions to action.similar-package-reviewer!

<!-- Please see our CONTRIBUTING.md file for more information on how to contribute. -->

## License

action.similar-package-reviewer is released under the MIT. See [LICENSE](./LICENSE) for more details.
