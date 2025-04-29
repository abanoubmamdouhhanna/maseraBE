import Router from "express";
import * as userController from "./controller/user.controller.js";

// import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();
//add user
router.post("/add",userController.add)

//get user
router.post("/getUser",userController.getUser)

//add money
router.patch("/addMoney",userController.addMoney)

export default router;
