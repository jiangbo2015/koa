import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";

const capsuleSchema = new mongoose.Schema(
  {
    name: String,
    status: { type: String, enum: ['pending', 'draft', 'published'], default: 'draft' },
    isDel: {
      type: Number,
      default: 0,
    },
    arrangement: {
        type: String,
        default: '5',
    },
    capsuleItems: [
        {    
            type: { type: String, enum: ['style', 'img', 'video'], default: 'style' },
            fileUrl: String,
            style: { type: mongoose.Schema.Types.ObjectId, ref: "style" },
            finishedStyleColorsList: [ { 
                    imgUrlFront: {
                        type: String,
                        required: true,
                    },
                    imgUrlBack: {
                        type: String,
                        required: true,
                    },
                    colors: [ { type: mongoose.Schema.Types.ObjectId, ref: "color" } ],
                    texture: { type: mongoose.Schema.Types.ObjectId, ref: "color" }
            } ],
        }
    ],
    plainColors: [ { type: mongoose.Schema.Types.ObjectId, ref: "color" } ],
    flowerColors: [ { type: mongoose.Schema.Types.ObjectId, ref: "color" } ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

capsuleSchema.plugin(uniqueValidator);
capsuleSchema.plugin(paginate);

const capsuleModel = mongoose.model("capsule", capsuleSchema);

export default capsuleModel;
