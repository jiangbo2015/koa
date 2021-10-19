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
    orderNo: String,
    capsuleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "capsule",
    },
    orderGoodNo: String,
    packageCount: Number,
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "capsule-order",
    }], 
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
        aboutCases: Number, //大约箱数
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
    sumCount: Number,
    sumPrice: Number,
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
