# OctoFit Tracker Frontend

The frontend reads the backend host from `VITE_CODESPACE_NAME`. Define it in
`.env.local` when running in Codespaces:

```bash
VITE_CODESPACE_NAME=curly-bassoon-46gjpj97r66hjv79
```

When the variable is not set, the app safely falls back to
`http://localhost:8000` for local backend development.

## Development

```bash
npm run dev -- --host 0.0.0.0
```

The Vite development server runs on port `5173`.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
