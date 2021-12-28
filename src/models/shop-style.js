import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";

/**
 * status规则, 0-未发布，1-发布
 */
const shopStyleSchema = new mongoose.Schema(
  {
    size: String,
    status: {
      type: Number,
      //   required: true,
      enum: [0, 1],
    },
    code: String,
    price: Number,
    bagsNum: Number, // 中包数
    caseNum: Number, // 装箱数
    stock: Number, //库存
    numInBag: Number, // 中包装数
    salesNumber: { type: Number, default: 0 }, //已售数量
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
    }, // 品牌
    branchKind: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch-kind",
    }, // 品牌分类
    goodCategory: {
        name: String,
        enname: String,
    },
    colorWithStyleImgs: [
      {
        type: {
          type: Number,
          enum: [0, 1], // 1 有相关的代表定制的款式
        },
        style: {
          // 当type=1时 才有值
          type: mongoose.Schema.Types.ObjectId,
          ref: "style",
        },
        color: {
          // 当type=1时 才有值
          type: mongoose.Schema.Types.ObjectId,
          ref: "color",
        },
        imgs: [String],
        sizeWithQuantity: { type: Object, default: {} },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

shopStyleSchema.virtual("colorWithStyleImgs.colorObj", {
  ref: "color",
  localField: "colorWithStyleImgs.color",
  foreignField: "_id",
  justOne: true,
});

shopStyleSchema.plugin(uniqueValidator);
shopStyleSchema.plugin(paginate);

const shopStyleModel = mongoose.model("shopStyle", shopStyleSchema);

export default shopStyleModel;
