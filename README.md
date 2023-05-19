# USSD GSM Service Portal
This project is used for handling SMS campaigns for telecommunications companies. It is built on Angular.
## Installation
Install the Angular CLI globally:

`npm install -g @angular/cli`

Install the project dependencies:

`npm install`

## Usage
Run the development server:

`ng serve`
Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.
## Build
Run ng build to build the project. The build artifacts will be stored in the dist/ directory. Use the --prod flag for a production build.

`ng build --prod`

## Running end-to-end tests
Run ng e2e to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

`ng e2e`
## Further help
To get more help on the Angular CLI use ng help or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
## Project structure
src/
- app/
- components/      // Presentational components
- containers/      // Container components
- models/          // Data models
- services/        // Services
- app.component.*  // Top level component
- app.module.ts    // Application module
- assets/             // Static assets
- environments/      // Environment config files
- styles.scss        // Global styles
