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
        ref: "capsules",
    },
    style: { type: mongoose.Schema.Types.ObjectId, ref: "styles" },
    finishedStyleColorsList: [ { 
            imgUrlFront: {
                type: String,
                required: true,
            },
            imgUrlBack: {
                type: String,
                required: true,
            },
            colors: [ { type: mongoose.Schema.Types.ObjectId, ref: "colors" } ],
            texture: { type: mongoose.Schema.Types.ObjectId, ref: "colors" }
     } ]
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
