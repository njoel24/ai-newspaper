# @ai-newspaper/article-ui

A Lit web component that displays and manages articles with React integration.

## Features

- Lit-based web component
- React integration using `createRoot`
- Independent build process
- Can be published and used in any project

## Development

```bash
# Build the package
npm run build

# Watch mode (auto-rebuild on changes)
npm run dev
```

## Usage

### In this project

The component is imported via alias in the main app:

```typescript
import '@ai-newspaper/article-ui';
```

### In other projects

```bash
npm install @ai-newspaper/article-ui
```

```typescript
import '@ai-newspaper/article-ui';

// Use in HTML
<article-ui></article-ui>
```

## API

### Methods

- `refresh()` - Refreshes the article list

### Component Structure

- Built with Lit for web component functionality
- Uses React for internal UI rendering
- Shadow DOM with scoped styles
- Peer dependencies: `lit`, `react`, `react-dom`

## Build Output

- `dist/article-ui.js` - ES module bundle
- External dependencies: `lit`, `react`, `react-dom`
- Size: ~27KB (8KB gzipped)
