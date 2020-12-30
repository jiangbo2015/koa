import mongoose from "mongoose";

const goodsSchema = new mongoose.Schema(
  {
    namecn: String,
    nameen: String,
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
