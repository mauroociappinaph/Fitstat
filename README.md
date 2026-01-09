<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1a4CzyZUANK_YbIttl7g9pHofNtZiP1LZ

## Run Locally

**Prerequisites:** Node.js

1.  Install dependencies:
    `npm install`
2.  Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3.  Run the app:
    `npm run dev`

## Development Commands

-   **Linting**: `npm run lint` - Check for code quality issues.
-   **Testing**: `npm run test` - Run automated tests.
-   **Build**: `npm run build` - Build the application for production.

## Production Status

This project is configured with:
-   **CI/CD**: GitHub Actions workflow for automated checks.
-   **Code Quality**: ESLint + Prettier.
-   **Testing**: Vitest integration.
