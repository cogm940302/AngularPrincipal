// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name: 'qa',
  // baseUrl: 'https://2u597e7kmf.execute-api.us-east-1.amazonaws.com/test/usuario'
  baseUrl: 'https://qa-api.mitidentity.com/usuario',
  fingerJsToken: 'M3ctjYXlZ7GFJRohWEjH',
  secureTouchToken: 'cc091bb3a3e3bef61d49e360dcfdbc84'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
