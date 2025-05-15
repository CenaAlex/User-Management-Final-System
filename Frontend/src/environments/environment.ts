// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiUrl: 'http://localhost:4000',
    useFakeBackend: false,  // Set to false to use real backend, true to use fake backend
    firebase: {
        apiKey: "AIzaSyBNjd67o9UE6SFtk02Jj_CjBE4nXr7W7gs",
        authDomain: "grouph-user-management-s-476a4.firebaseapp.com",
        projectId: "grouph-user-management-s-476a4",
        storageBucket: "grouph-user-management-s-476a4.firebasestorage.app",
        messagingSenderId: "734704388092",
        appId: "1:734704388092:web:0990f24e8832603419547a"
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
