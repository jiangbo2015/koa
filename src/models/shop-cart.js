import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    shopStyle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shopStyle",
    },
    count: Number,
    date: String,
    isDel: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

orderSchema.plugin(uniqueValidator);

const orderModel = mongoose.model("shop-cart", orderSchema);

export default orderModel;
