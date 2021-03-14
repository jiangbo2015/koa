import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    orderNo: String,
    goodsId: String,
    orderGoodNo: String,
    packageCount: Number,
    isReaded: {
      type: Number,
      default: 0,
    },
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
        sizeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "size",
        },
        styleNos: String,
        packageCount: Number,
        cnts: Number,
        aboutCases: Number, //大约箱数
        rowTotal: Number,
        rowTotalPrice: Number,
        rowRemarks: String,
        pickType: Object,
        items: [
          {
            favoriteId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "favorite",
            },
            sizeInfo: Array,
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

orderSchema.virtual("orderData.items.favorite", {
  ref: "favorite",
  localField: "orderData.items.favoriteId",
  foreignField: "_id",
  justOne: true,
});

orderSchema.virtual("orderData.size", {
  ref: "size",
  localField: "orderData.sizeId",
  foreignField: "_id",
  justOne: true,
});

// orderSchema.set("toObject", { virtuals: true })
// orderSchema.set("toJSON", { virtuals: true })
// orderSchema.virtual("favor").get(function() {
// 	return this.packageCount
// })

orderSchema.plugin(uniqueValidator);

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
