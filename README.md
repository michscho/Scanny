# Raycast for the Browser

Raycast for the Browser is a Chrome extension that brings a command palette to any webpage so you can search, navigate, and interact without leaving the keyboard.

## Requirements

- Node.js 18+ (Node.js 20 recommended)
- npm 9+
- Google Chrome

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Build once:

```bash
npm run build
```

3. For active development, run watch mode in a separate terminal:

```bash
npm run watch
```

## Load the Extension in Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `build/` directory from this project.
5. Open any website and use `Ctrl+Shift+K` (`Cmd+Shift+K` on macOS) to open the command palette.

## Testing

This project currently has no unit/integration test suite yet. Recommended verification flow:

1. Static/type checks:

```bash
npm run typecheck
```

2. Production build:

```bash
npm run build
```

3. Manual smoke test in Chrome:
- Load `build/` as unpacked extension.
- Open a regular website (for example `https://example.com`).
- Trigger the palette with `Ctrl+Shift+K` / `Cmd+Shift+K`.
- Confirm the UI appears.
- Run a simple page-element search in `>` mode and verify matching elements are found/highlighted.

## Packaging Notes

- The extension manifest is at `public/manifest.json`.
- Build artifacts are emitted to `build/`.
