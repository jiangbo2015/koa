import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";

const capsuleSchema = new mongoose.Schema(
  {
    name: String,
    status: { type: String, enum: ['draft', 'pending', 'published'], default: 'draft' },
    isDel: {
      type: Number,
      default: 0,
    },
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
