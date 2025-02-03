import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";


const capsuleItemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['style', 'img', 'video'], default: 'style' },
    fileUrl: String,
    isDel: { type: Number,default: 0 }, 
    capsule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "capsule",
    },
    styleId: { type: mongoose.Schema.Types.ObjectId, ref: "style" },
    colorIds: [ { type: mongoose.Schema.Types.ObjectId, ref: "color" } ]
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

capsuleItemSchema.plugin(uniqueValidator);
capsuleItemSchema.plugin(paginate);

const capsuleItemModel = mongoose.model("capsuleItem", capsuleItemSchema);

export default capsuleItemModel;
