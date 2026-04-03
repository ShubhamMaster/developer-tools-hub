# Contributing

Thanks for your interest in improving Developer Tools Hub. This guide covers the basics to get you shipping fast.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

- `src/config/tools.js` contains the tool registry (category, group, slug, component path).
- `src/tools/<slug>/` contains each tool's UI and logic.
- `src/components/` contains shared UI elements.

## Adding a Tool

1. Create a new tool component under `src/tools/<slug>/YourTool.jsx`.
2. Register the tool in `src/config/tools.js`.
3. Ensure the tool renders in the dashboard and sidebar.

## Pull Requests

- Keep PRs focused and small.
- Run `npm run build` before opening a PR.
- Include screenshots for UI changes.
- Describe the problem and the solution clearly.

## Reporting Bugs

Please use the GitHub issue templates and include steps to reproduce, expected behavior, and screenshots if possible.
