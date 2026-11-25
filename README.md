# LearnerHub

LearnerHub is an Adobe Experience Manager (AEM) as a Cloud Service learning portal. It provides course catalog and detail pages, learning paths, and learning resources, built with reusable AEM components and responsive frontend styles.

## Features

- Browse courses, learning paths, and learning resources.
- Search and filter the course catalog.
- Render course details with a Learning Hero that supports an image or an MP4/WebM video, including optional captions.
- Manage page templates, content, and OSGi configuration through AEM packages.
- Compile frontend JavaScript and Sass into AEM client libraries.

## Technology

- AEM as a Cloud Service and the AEM SDK
- Java 11, Maven, Sling Models, OSGi, and HTL
- Webpack, JavaScript/TypeScript, Sass, and AEM Client Libraries
- JUnit-based integration tests and Cypress UI tests
- Cloud-optimized Dispatcher configuration

## Repository modules

| Module | Purpose |
| --- | --- |
| `core` | OSGi bundle containing Java models, services, and business logic. |
| `dispatcher` | Cloud-optimized Dispatcher and web server configuration. |
| `ui.apps` | AEM components, templates, client libraries, and application code. |
| `ui.apps.structure` | Defines the repository structure for the application packages. |
| `ui.config` | OSGi configuration for AEM run modes. |
| `ui.content` | Initial site content, templates, and content configuration. |
| `ui.frontend` | Webpack frontend build; compiles JavaScript and Sass and generates client libraries. |
| `it.tests` | Java integration tests that run against AEM instances. |
| `ui.tests` | Cypress end-to-end UI tests. |
| `all` | Aggregates the application packages for convenient deployment. |

## Requirements

- Java 11
- Maven 3
- Node.js 16.17.0 and npm 8.15.0 for frontend builds (these versions are configured in the Maven frontend plugin)
- A local AEM SDK author instance for local deployment; the default URL is `http://localhost:4502`
- A local publish instance at `http://localhost:4503` when running integration tests that require publish

## Build and deploy

Run commands from the repository root.

Build and test all Maven modules:

```shell
mvn clean install
```

Build and install the aggregate package to the local AEM author instance:

```shell
mvn clean install -PautoInstallSinglePackage
```

Install only the Core bundle:

```shell
mvn clean install -pl core -PautoInstallBundle
```

Build and install the `ui.apps` package:

```shell
mvn clean install -pl ui.apps -PautoInstallPackage
```

Local deployment profiles use the host, port, and credentials configured in the Maven POM/settings. Do not commit credentials.

## Frontend development

The frontend source is under `ui.frontend/src/main/webpack`:

```text
components/
  *.scss         Existing Core Component Sass styles
  scripts/       Component JavaScript
  styles/        LearnerHub-specific component Sass styles
site/
  scripts/       Site behavior
  styles/
    foundation/  Shared Sass variables and base styles
    layouts/     Shared layout styles
    experience-fragments/
    pages/       Page-specific styles
  main.ts        Webpack JavaScript entry point
  main.scss      Webpack Sass entry point
```

Install frontend dependencies and build the client libraries:

```shell
cd ui.frontend
npm ci
npm run prod
```

For development, run `npm start` from `ui.frontend` to start the Webpack development server. `npm run dev` generates a non-production frontend build.

## Tests

Run the configured Maven tests:

## Deployment

Production deployments are performed through Adobe Cloud Manager Full Stack Pipelines. Validate Dispatcher configuration with the Dispatcher SDK/Tools before deployment.

## License

See [LICENSE](LICENSE).
