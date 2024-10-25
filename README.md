# Full Stack Developer

## Nx Workspace

This repository is an integrated mono repo using the Nx develoepr toolkit.  Why a mono repo?  The final project will have many moving parts including separate backend and front end applications.  Usign the Mono Repo we can work with all working components and share source code more easily across applications.

For more information on [Why Nx Workspaces](https://nx.dev/getting-started/why-nx)

One of the hidden features of using Nx Workspaces is the build and test optimizations.  The build management scripts leverage a project dependency map that identifies what scripts or modules are affected by any changes since the last commit and then allows you to build/test only those modules or applications - thus saving time from building/testing modules/features/applications that have not changed.

### Workspace structure

the `./apps` folder contains a folder for each independently deployable application, along with a secondary folder to contain end-to-end test cases and test helper functions.  Each applicaiton is intended to be a small, light wrapper around shared code and functionality.

### management scripts

**Quick Start**

I have created some npm scripts to make it easy to perform the basic tasks on this project without understanding the Nx DevTools framework.

| CLI | Description |
|-----------------|-------------------|
| `npm run build`  | build and save the development artifacts into the `dist` folder |
| `npm run lint`   | run lint on all ts code |
| `npm run format` | run prettier on all ts / md files |
| `npm test`       | run jest for api-server spec files |
| `npm e2e`        | run cypress for api-e2e files |
| `npm start`      | build api-server and start as development server (auto-reloading) |


**Using Nx Console**

The easiest way to manage the application lifecycle is to use the **Nx Console** extension for VS Code.  This will provide simple navigation of available commands to build, lint, format, test, serve, package...

`npx nx run ${app-name}:${command} --{option}={value}`

**applications**
1. api-server

**commands**
1. build
2. lint
3. test
4. e2e
5. serve

**configuration**
1. development
2. production

#### examples

##### Using the `affected` graph

**build all apps and dependencies affected by current file change**
`nx affected --target=build`

**lint all deps affected by current file changes**
`nx affected --target=lint`

**build the api-server**
`npx nx run api-server:build`

`npx nx run api-server:lint`
`npx nx run api-server:test`

`npx nx run api-server:serve --configuration=development`

### Notes

The difference between serve development and production is that development builds include source maps, production does not.

## Backend Web Service API with ExpressJS

