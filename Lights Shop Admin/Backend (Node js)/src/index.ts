require('module-alias/register');
import { Application } from "./App";

console.log('The application was started!');
Application.createApplication().then(() => {
    console.log('The application was started!');
    console.info('The application was started! Kill it using Ctrl + C');
});
