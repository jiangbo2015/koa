import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";

/**
 * code规则, S-素色，H-花色，版式-B
 */
const capsuleStyleSchema = new mongoose.Schema(
  {
    size: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "size",
    },
    code: String,
    price: Number,
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

capsuleStyleSchema.plugin(uniqueValidator);
capsuleStyleSchema.plugin(paginate);

const capsuleStyleModel = mongoose.model("capsuleStyle", capsuleStyleSchema);

export default capsuleStyleModel;
