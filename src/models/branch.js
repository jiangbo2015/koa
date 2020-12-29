import mongoose from "mongoose";

const goodsSchema = new mongoose.Schema(
  {
    namecn: String,
    nameen: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const BranchModel = mongoose.model("branch", goodsSchema);

export default BranchModel;
