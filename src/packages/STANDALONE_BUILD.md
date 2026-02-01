# Standalone Build Scripts

These scripts automatically handle the conversion of `peerDependencies` to `dependencies` for standalone builds, then restore the original `package.json` after the build completes.

## Usage

### For article-ui:
```bash
cd src/packages/article-ui
npm run build:standalone:full
```

### For evaluator-ui:
```bash
cd src/packages/evaluator-ui
npm run build:standalone:full
```

## What the script does

1. **Backup**: Reads and stores the original `package.json` content
2. **Convert**: Moves all `peerDependencies` to `dependencies` and removes the `peerDependencies` field
3. **Build**: Runs the standalone build (`STANDALONE=true vite build`)
4. **Restore**: Restores the original `package.json` file (even if the build fails)

## Output

The standalone builds are created in:
- `article-ui/dist/standalone/article-ui.standalone.js`
- `evaluator-ui/dist/standalone/evaluator-ui.standalone.js`

These standalone builds include all dependencies bundled together (~774KB each, ~185KB gzipped).

## Why this is needed

Standalone builds need all dependencies bundled into a single file. By temporarily converting `peerDependencies` to `dependencies`, Vite can properly resolve and bundle these packages. The script ensures that the `package.json` is always restored to its original state, preserving the correct peer dependency declarations for normal (federated) builds.
