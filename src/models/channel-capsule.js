import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";

const channelCapsuleSchema = new mongoose.Schema(
  {
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "channels",
    }, 
    capsuleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "capsule",
    }, 
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const channelCapsuleModel = mongoose.model("channel-capsule", channelCapsuleSchema);

export default channelCapsuleModel;
