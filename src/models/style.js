import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");
import paginate from "mongoose-paginate";
function transform(doc, ret) {
  console.log(ret);
  ret.plainColors.map((item) => {
    if (typeof item.colorId === "object") {
      item.code = item.colorId.code;
      item.value = item.colorId.value;
      item.type = item.colorId.type;
      item.colorId = item.colorId._id;
    }
  });
  ret.flowerColors.map((item) => {
    if (typeof item.colorId === "object") {
      item.code = item.colorId.code;
      item.value = item.colorId.value;
      item.type = item.colorId.type;
      item.colorId = item.colorId._id;
    }
  });
}

/**
 * 样式管理
 */
const styleSchema = new mongoose.Schema(
  {
    styleNo: {
      type: String,
      required: true,
    },
    styleSize: {
      type: Number,
      required: true,
    },
    styleBackSize: {
      type: Number,
      required: true,
    },
    styleName: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    scale: Number,
    svgUrl: {
      type: String,
      required: true,
    },
    shadowUrl: {
      type: String,
      required: true,
    },
    svgUrlBack: {
      type: String,
      required: true,
    },
    shadowUrlBack: {
      type: String,
      required: true,
    },
    weight: Number,
    vposition: String,
    // hposition: String,
    size: String,
    currency: Number,
    goodsId: Array,
    categoryId: Array,
    categoryName: String,
    attrs: [
      {
        colorId: String,
        x: Number,
        y: Number,
        scale: Number,
      },
    ],
    channels: [
      {
        channelId: String,
        sizeIds: Array,
      },
    ],
    tags: Array,
    isDel: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

styleSchema.plugin(uniqueValidator);
styleSchema.plugin(paginate);
const StyleModel = mongoose.model("style", styleSchema);

export default StyleModel;
