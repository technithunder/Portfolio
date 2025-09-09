import express, { Express } from "express";
import { Server } from "http";
import compress from "compression";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { connection } from "@/config/db.config";
import "module-alias/register";
import productRoutes from "@/product/routes";
import adminRoutes from "@/admin/routes";
import orderRoutes from "@/order/routes";
import staffRoutes from "@/staff/routes";
import dealerRoutes from "@/dealer/routes";
import userRoutes from "@/user/routes";
import cartRoutes from "@/cart/routes";
import { setupSwagger } from "./utils/swagger";
import OrderStaffRoute from "./orderStaff/routes";
import whishRoute from "./whishlist/routes";
import leadRoute from "./lead/router";
import notificationRoute from "./notification/routes";
import reviewRoute from "./review/routes";
import categoryRoute from "./category/routes";
import dailyProgessRoute from "./dailyProgress/routes";
import staffLeadRoute from "./leadStaff/routes";
import dashboardRoute from "./dashBoard/routes";
import complaintRouter from "./complaint/routes";

const cors = require("cors");

const defaultRoutes = [
  {
    path: "/product",
    route: productRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/order",
    route: orderRoutes,
  },
  {
    path: "/staff",
    route: staffRoutes,
  },
  {
    path: "/dealer",
    route: dealerRoutes,
  },
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/cart",
    route: cartRoutes,
  },
  {
    path: "/orderStaff",
    route: OrderStaffRoute,
  },
  {
    path: "/wishList",
    route: whishRoute,
  },
  {
    path: "/lead",
    route: leadRoute,
  },
  {
    path: "/notification",
    route: notificationRoute,
  },
  {
    path: "/review",
    route: reviewRoute,
  },
  {
    path: "/category",
    route: categoryRoute,
  },
  {
    path: "/daily-progress",
    route: dailyProgessRoute,
  },
  {
    path: "/leadStaff",
    route: staffLeadRoute,
  },
  {
    path: "/dashboard",
    route: dashboardRoute,
  },
  {
    path: "/complaint",
    route: complaintRouter,
  },
];

export class ExpressServer {
  private server?: Express;
  private httpServer?: Server;

  constructor() { }

  public async setup(port: number, router: any) {
    const server = express();
    this.setupStandardMiddlewares(server);
    this.setupSecurityMiddlewares(server);
    this.configureApiEndpoints(server, router);
    setupSwagger(server);

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
      res.header("Access-Control-Allow-Origin", "*");
      next();
    });
    server.options(
      "*",
      cors({
        "Access-Control-Allow-Origin": "*",
        "Access-control-Allow-Methods": "GET,POST,OPTIONS,PUT,PATCH,DELETE",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type",
      })
    );
  }

  private setupStandardMiddlewares(server: Express) {
    const payLoadSize = "500mb";
    server.use(express.json({ limit: payLoadSize }));
    server.use(
      bodyParser.urlencoded({
        extended: false,
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

    server.use("/api", router);
  }
  private connectDatabase() {
    connection();
  }
}
