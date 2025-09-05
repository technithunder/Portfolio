require('module-alias/register');
import { Application } from './App';

Application.createApplication().then(() => {
    console.info('The application was started! Kill it using Ctrl + C');
});
