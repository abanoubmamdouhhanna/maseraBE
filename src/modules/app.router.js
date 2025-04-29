import cookieParser from "cookie-parser";
import connectDB from "../../DB/connection.js";
import { glopalErrHandling } from "../utils/errorHandling.js";
import { AppError } from "../utils/appError.js";
import userRouter from "./user/user.router.js";

const initApp = (app, express) => {
  // Built-in Middleware
  app.use(express.json());
  app.use(cookieParser());

  // Routes
  app.use("/user", userRouter);


  // Catch-all for undefined routes
  app.use((req, res, next) => {
    next(
      new AppError("Not Found", 404, {
        method: req.method,
        url: req.originalUrl,
      })
    );
  });

  // Global Error Handler
  app.use(glopalErrHandling);

  // Connect to DB
  connectDB();
};

export default initApp;
