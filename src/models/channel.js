import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";

const channelSchema = new mongoose.Schema(
  {
    name: String,
    code: String, // 代号
    remark: String, // 备注
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    }, //所属人
    styles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "style",
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
    textures: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "color",
        },
    ],
    capsules: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "capsule",
        },
    ]
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

channelSchema.plugin(uniqueValidator);
channelSchema.plugin(paginate);

const ChannelModel = mongoose.model("channels", channelSchema);

export default ChannelModel;
