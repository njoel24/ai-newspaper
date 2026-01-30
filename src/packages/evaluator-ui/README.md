# @ai-newspaper/evaluator-ui

A Lit web component that displays and manages evaluations with React integration.

## Features

- Lit-based web component
- React integration using @lit/react wrapper
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
import '@ai-newspaper/evaluator-ui';
```

### In other projects

```bash
npm install @ai-newspaper/evaluator-ui
```

```typescript
import '@ai-newspaper/evaluator-ui';

// Use in HTML
<evaluator-ui showInfo={true}></evaluator-ui>
```

## API

### Properties

- `showInfo` (boolean) - Whether to display info label
- `onLoaded` (function) - Callback when component loads

### Methods

- `refresh()` - Refreshes the evaluation data

## Component Structure

- Built with Lit for web component functionality
- Uses @lit/react for React wrapper
- Uses React for internal UI rendering
- Shadow DOM with scoped styles
- Dependencies: `@lit/react`, `lit`, `react`, `react-dom`

## Build Output

- `dist/evaluator-ui.js` - ES module bundle
- External dependencies: `lit`, `react`, `react-dom`
- Size: ~25KB (7.6KB gzipped)
