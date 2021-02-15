import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    date: String,
    isDel: {
      type: Number,
      default: 0,
    },
    sumCount: Number,
    sumPrice: Number,
    orderData: [
      {
        shopStyleObj: Object,
        count: Number,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

orderSchema.plugin(uniqueValidator);

const orderModel = mongoose.model("shop-order", orderSchema);

export default orderModel;
