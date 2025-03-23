import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";

/**
 * type: 0-素色，1-花色
 * code规则, S-素色，H-花色，版式-B
 */
const colorSchema = new mongoose.Schema(
  {
    type: {
      type: Number,
      required: true,
      enum: [0, 1],
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    isDel: {
        type: Number,
        default: 0,
    },

    flowerCode: String,
    goodsId: Array,
    categoryId: Array,
    value: String,
    width: Number,
    height: Number,
    size: Number,
    sizeOrigin: Number,
    colorSystem: { type: Number, default: 0 },
    namecn: String,
    nameen: String,
    relatedColors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "color",
      },
    ],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    isCustom: {
        type: Number,
        default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

colorSchema.plugin(uniqueValidator);
colorSchema.plugin(paginate);

const colorModel = mongoose.model("color", colorSchema);

export default colorModel;
