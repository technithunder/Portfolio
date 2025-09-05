import express, { Express } from 'express';
import { Server } from 'http';
import compress from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { connection } from '@/config/db.config';
import 'module-alias/register';
import authRoutes from '@/auth/routes';
import visaRoutes from '@/admin/country/routes';
import adminRoutes from '@/admin/login/routes';
import visaApplicationRoutes from '@/visaApplication/routes';
import categoryRoutes from '@/admin/visaCategory/routes';
import visaTypeRoutes from '@/admin/visaType/routes';
import childUserRoute from '@/childUser/routes/index';
import scheduledCallRoutes from '@/scheduledCall/routes';
import paymentRoutes from '@/payment/routes';
import scheduleCallPaymentRoutes from '@/payment/routes/schedule-call-payment.routes';
import scheduleCallAmountRoutes from '@/admin/scheduleCallAmount/routes';
import staffRoutes from '@/admin/staff/routes'; 
const cors = require('cors');

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path:'/admin/staff',
        route:staffRoutes
    },
    {
        path: '/visa',
        route: visaRoutes
    },
    {
        path: '/admin',
        route: adminRoutes
    },
    {
        path: '/visaApplication',
        route: visaApplicationRoutes
    },
    {
        path: '/admin/category',
        route: categoryRoutes
    },
    {
        path: '/admin/visaType',
        route: visaTypeRoutes
    },
    {
        path: '/childUser',
        route: childUserRoute
    },
    {
        path: '/scheduled-call',
        route: scheduledCallRoutes
    },
    {
        path: '/payment',
        route: paymentRoutes
    },
    {
        path: '/payment/schedule-call',
        route: scheduleCallPaymentRoutes
    },
    {
        path: '/schedule-call-amount',
        route: scheduleCallAmountRoutes
    }
];

export class ExpressServer {
    private server?: Express;
    private httpServer?: Server;

    constructor() {}

    public async setup(port: number, router: any) {
        const server = express();
        this.setupStandardMiddlewares(server);
        this.setupSecurityMiddlewares(server);
        this.configureApiEndpoints(server, router);
        this.connectDatabase();
        this.httpServer = this.listen(server, port);
        this.server = server;
        return this.server;
    }

    public listen(server: Express, port: number) {
        console.info(`Starting server on port ${port}`);
        return server.listen(port);
    }

    public kill() {
        if (this.httpServer) this.httpServer.close();
    }

    private setupSecurityMiddlewares(server: Express) {
        server.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            next();
        });
        server.options(
            '*',
            cors({
                'Access-Control-Allow-Origin': '*',
                'Access-control-Allow-Methods': 'GET,POST,OPTIONS,PUT,PATCH,DELETE',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type'
            })
        );
    }

    private setupStandardMiddlewares(server: Express) {
        const payLoadSize = '500mb';
        server.use(express.json({ limit: payLoadSize }));
        server.use(
            bodyParser.urlencoded({
                extended: false
            })
        );
        server.use(bodyParser.json());
        server.use(cookieParser());
        server.use(compress());
    }

    private configureApiEndpoints(server: Express, router: any) {
        defaultRoutes.forEach((route) => {
            router.use(route.path, route.route);
        });

        server.use('/api', router);
    }
    private connectDatabase() {
        connection();
    }
}
