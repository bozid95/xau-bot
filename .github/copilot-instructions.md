# Copilot Instructions for XAUUSD Telegram Trading Bot

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Next.js application that serves as a Telegram bot for XAUUSD (Gold) trading signals. The bot receives signals from TradingView webhooks and sends notifications to Telegram users.

## Key Technologies

- **Next.js 15** with App Router
- **Telegram Bot API** for notifications
- **TradingView Webhooks** for signal reception
- **Tailwind CSS** for styling
- **Vercel** for deployment

## Code Style Guidelines

- Use JavaScript (not TypeScript) for all components
- Implement App Router pattern with `src/app` directory
- Use Server Actions for API endpoints where appropriate
- Follow Next.js 15 best practices for Vercel deployment
- Use Tailwind CSS for all styling
- Implement proper error handling for webhook and Telegram API calls

## Project Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and configurations
- `/src/app/api` - API endpoints for webhooks and bot operations
- `/public` - Static assets

## Deployment Considerations

- Optimize for Vercel's serverless functions
- Use environment variables for sensitive data
- Implement proper webhook validation
- Handle Telegram API rate limits
- Ensure all API routes are stateless
