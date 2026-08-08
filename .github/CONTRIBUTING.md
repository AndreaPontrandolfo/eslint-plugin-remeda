# Contributing

Thank you for your interest in contributing to `eslint-plugin-remeda`! We welcome contributions of all kinds.

## Getting Started

1. **Fork the repository** and clone it locally.
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Run the development checks** to ensure everything is working:
   ```bash
   pnpm qa
   ```

## Development Workflow

- Make your changes in a new branch.
- Run `pnpm build` to build the plugin.
- Run `pnpm test` to run the test suite.
- Run `pnpm lint` to check for code style issues.
- Run `pnpm typecheck` to ensure TypeScript compiles without errors.
- If you add or modify rules, run `pnpm update:eslint-docs` to update the rule documentation automatically.
- Commit your changes and push to your fork.
- Open a Pull Request against the `main` branch of this repository.

## Commit Messages

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for your commit messages.

Thanks for helping make this project better!
