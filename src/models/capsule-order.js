import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    orderNo: String,
    capsuleId: String,
    orderGoodNo: String,
    packageCount: Number,

    date: String,
    isSend: {
      type: Number,
      default: 0,
    },
    isDel: {
      type: Number,
      default: 0,
    },
    orderData: [
      {
        rowTotal: Number,
        rowTotalPrice: Number,
        rowRemarks: String,
        pickType: Object,
        size: String,
        price: Number,
        styleNos: String,
        items: [
          {
            type: {
              type: Number,
              default: 0,
              enum: [0, 1], // 1 有相关的代表定制的款式
            },
            favorite: Object,
            imgs: [String],
            colorObj: Object,
            sizeInfoObject: Object,
            total: Number,
            totalPrice: Number,
            parte: Number,
          },
        ],
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
    // toJSON: {
    // 	virtuals: true
    // },
    // toObject: {
    // 	virtuals: true
    // }
  }
);

// orderSchema.set("toObject", { virtuals: true })
// orderSchema.set("toJSON", { virtuals: true })
// orderSchema.virtual("favor").get(function() {
// 	return this.packageCount
// })

orderSchema.plugin(uniqueValidator);

const orderModel = mongoose.model("capsule-order", orderSchema);

export default orderModel;
