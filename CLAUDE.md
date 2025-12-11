# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Nuxt 3 Module Federation Host Application** that consumes remote components from a separate remote application. It demonstrates Webpack Module Federation in a Nuxt 3 context.

**Key Architecture Points:**
- Uses Webpack (not Vite) as the build system to enable Module Federation
- SSR is disabled (`ssr: false`) to simplify client-side Module Federation
- Runs on port 3000 by default
- Consumes remote components from a remote application running on port 3001

## Development Commands

```bash
# Start both host and remote apps (recommended)
./start-all.sh

# Or start individually:

# Development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build (runs on port 3000)
npm run preview

# Generate static site
npm run generate

# Post-install hook (prepares Nuxt)
npm run postinstall
```

**IMPORTANT:** The remote app MUST be running on port 3001 before starting the host app, otherwise Module Federation will fail to load remote components.

## Module Federation Configuration

The Module Federation setup is configured in [nuxt.config.ts](nuxt.config.ts) using Webpack's `ModuleFederationPlugin`:

**Host Configuration:**
- **Name:** `hostApp`
- **Remote:** `remoteApp` at `http://localhost:3001/_nuxt/remoteEntry.js`
- **Shared Dependencies:** `vue` and `vue-router` (singleton, eager loading)

The remote URL is also exposed via `runtimeConfig.public.remoteUrl` for runtime access.

## Project Structure

```
/
├── app.vue                    # Root application component
├── components/
│   └── RemoteWrapper.vue      # Wrapper for loading remote components
├── remote.d.ts                # TypeScript declarations for remote modules
├── nuxt.config.ts             # Nuxt config with Module Federation setup
├── package.json
└── tsconfig.json
```

## Remote Component Integration

Remote components are loaded via the `RemoteWrapper.vue` component which:

1. Uses Vue's `defineAsyncComponent` to dynamically import `remoteApp/Widget`
2. Wraps the remote component in `<Suspense>` for async loading states
3. Includes error handling with retry logic (up to 3 attempts)
4. Shows loading and error states appropriately

**TypeScript Support:**
Remote module types are declared in [remote.d.ts](remote.d.ts). When adding new remote components, add their type declarations here:

```typescript
declare module "remoteApp/ComponentName" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

## Important Development Notes

1. **Webpack Builder Required:** This project must use Webpack (not Vite) because Module Federation is a Webpack feature. The builder is set in `nuxt.config.ts`.

2. **Remote Application Dependency:** The remote application must be running on port 3001 for the host to load remote components. Start the remote app first during development.

3. **SSR Disabled:** Module Federation works client-side only in this setup (`ssr: false`), which simplifies the configuration but means no server-side rendering.

4. **Webpack Configuration Hook:** Module Federation is injected via the `webpack:config` hook in `nuxt.config.ts`. Any Webpack configuration changes should be made carefully to avoid breaking Module Federation.

5. **Shared Dependencies:** Vue and Vue Router are configured as singleton shared dependencies to ensure only one instance runs across host and remote applications.

## Adding New Remote Components

1. Ensure the remote component is exposed in the remote application's Module Federation configuration
2. Add TypeScript declaration in [remote.d.ts](remote.d.ts)
3. Import and use the component via `defineAsyncComponent` similar to [RemoteWrapper.vue](components/RemoteWrapper.vue)
4. Wrap in `<Suspense>` for proper async handling

## Common Issues and Solutions

### "Loading script failed" Error

If you see errors like:
```
❌ 無法載入遠端元件: Loading script failed. (missing: http://localhost:3001/_nuxt/remoteEntry.js)
```

**Solutions:**
1. **Ensure remote app is running first:** Start `nuxt3-mf-remote` on port 3001 before starting the host app
2. **Check publicPath configuration:** Remote app must use absolute publicPath: `http://localhost:3001/_nuxt/`
3. **Verify CORS headers:** Remote app should have CORS enabled for `/_nuxt/**` routes
4. **Clear both apps and restart:** Use `./start-all.sh` to properly start both apps in order

### Critical Configuration Requirements

Both apps MUST have these Webpack configurations:

**Host App ([nuxt.config.ts](nuxt.config.ts)):**
- `config.output.publicPath = "auto"` - Let Webpack handle path resolution
- `config.output.uniqueName = "hostApp"` - Unique identifier
- `config.optimization.splitChunks = false` - Disable code splitting

**Remote App (`../nuxt3-mf-remote/nuxt.config.ts`):**
- `config.output.publicPath = "http://localhost:3001/_nuxt/"` - Absolute URL required
- `config.output.uniqueName = "remoteApp"` - Unique identifier
- `config.optimization.splitChunks = false` - Disable code splitting
- `config.optimization.runtimeChunk = false` - Disable runtime chunk

### Other Issues

- **Type errors for remote modules:** Ensure type declarations exist in [remote.d.ts](remote.d.ts)
- **Build errors:** Check that Webpack builder is configured and Module Federation plugin is properly set up
- **Hot reload issues:** Module Federation may not work perfectly with HMR; restart both apps if needed
