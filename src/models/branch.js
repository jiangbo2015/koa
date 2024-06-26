import mongoose from "mongoose";

const goodsSchema = new mongoose.Schema(
  {
    namecn: String,
    nameen: String,
    status: {
        type: Number,
        required: true,
        enum: [0, 1],
    },
    description: String,
    descriptionen: String,
    isDel: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const BranchModel = mongoose.model("branch", goodsSchema);

export default BranchModel;
