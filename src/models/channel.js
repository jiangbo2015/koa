import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";

const channelSchema = new mongoose.Schema(
  {
    remark: String, // 备注
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    }, //所属人
    assignedId: String, //被分配ID
    codename: String, //代号
    // empower: Number,
    styles: [
      {
        style: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "style",
        },
        price: Number,
      },
    ],
    plainColors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "color",
      },
    ],
    flowerColors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "color",
      },
    ],
    capsuleStyles: [
      {
        style: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "shopStyle",
        },
        price: Number,
      },
    ],
    shopStyles: [
      {
        style: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "style",
        },

        price: Number,
      },
    ],
    categories: Array,
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
  }
);

channelSchema.plugin(uniqueValidator);
channelSchema.plugin(paginate);
const ChannelModel = mongoose.model("channels", channelSchema);

export default ChannelModel;
