import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    isReaded: {
      type: Number,
      default: 0,
    },
    isMerge: {
        type: Number,
        default: 0,
    },
    date: String,
    orderNo: String,
    isDel: {
      type: Number,
      default: 0,
    },

    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
    }], 
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
