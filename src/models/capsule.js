import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";

/**
 * code规则, S-素色，H-花色，版式-B
 */
const capsuleSchema = new mongoose.Schema(
  {
    status: {
      type: Number,
      required: true,
      enum: [0, 1],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    namecn: String,
    nameen: String,
    covermap: String,
    description: String,
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
