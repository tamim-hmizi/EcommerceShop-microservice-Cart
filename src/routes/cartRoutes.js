import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController.js";

const router = express.Router();

router.route("/").get(getCart).post(addToCart);

router.route("/update").put(updateCartItem);

router.route("/remove").delete(removeCartItem);

export default router;
