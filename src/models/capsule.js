import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";

/**
 * status规则, 0-发布，1-发布
 */
const capsuleSchema = new mongoose.Schema(
  {
    status: {
      type: Number,
      required: true,
      enum: [0, 1],
    },
    isDel: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    namecn: String,
    nameen: String,
    covermap: String,
    description: String,
    descriptionen: String,
    exhibition1: String,
    exhibition2: String,
    exhibition3: String,
    exhibition4: String,
    exhibition5: String,
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
