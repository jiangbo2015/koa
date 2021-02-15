import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";

const channelSchema = new mongoose.Schema(
  {
    remark: String, // 备注
    owner: String, //所属人
    assignedId: String, //被分配ID
    codename: String, //代号
    empower: Number,
    styles: [
      {
        styleId: String,
        price: Number,
        plainColors: Array,
        flowerColors: Array,
      },
    ],
    capsuleStyles: [
      {
        styleId: String,
        price: Number,
      },
    ],
    shopStyles: [
      {
        styleId: String,
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
