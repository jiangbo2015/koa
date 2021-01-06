import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";

/**
 * status规则, 0-未发布，1-发布
 */
const shopStyleSchema = new mongoose.Schema(
  {
    size: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "size",
    },
    status: {
      type: Number,
      //   required: true,
      enum: [0, 1],
    },
    code: String,
    price: Number,
    bagsNum: Number, // 中包数
    caseNum: Number, // 装箱数
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
    }, // 品牌
    branchKind: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch-kind",
    }, // 品牌分类
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
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

shopStyleSchema.plugin(uniqueValidator);
shopStyleSchema.plugin(paginate);

const shopStyleModel = mongoose.model("shopStyle", shopStyleSchema);

export default shopStyleModel;
