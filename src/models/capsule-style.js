import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";

/**
 * code规则, S-素色，H-花色，版式-B
 */
const capsuleStyleSchema = new mongoose.Schema(
  {
    size: String,
    capsule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "capsule",
    },
    isDel: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      default: 0,
    },
    code: String,
    price: {
      type: Number,
      default: 0,
    },
    goodCategory: {
      name: String,
      enname: String,
    },
    colorWithStyleImgs: [
      {
        type: {
          type: Number,
          default: 0,
          enum: [0, 1], // 1 有相关的代表定制的款式
        },
        favorite: {
          // 当type=1时 才有值
          type: mongoose.Schema.Types.ObjectId,
          ref: "favorite",
        },
        style: {
          // 当type=1时 才有值
          type: mongoose.Schema.Types.ObjectId,
          ref: "style",
        },
        color: {
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

capsuleStyleSchema.virtual("colorWithStyleImgs.colorObj", {
  ref: "color",
  localField: "colorWithStyleImgs.color",
  foreignField: "_id",
  justOne: true,
});

capsuleStyleSchema.plugin(uniqueValidator);
capsuleStyleSchema.plugin(paginate);

const capsuleStyleModel = mongoose.model("capsuleStyle", capsuleStyleSchema);

export default capsuleStyleModel;
