import mongoose from "mongoose";

const goodsSchema = new mongoose.Schema(
  {
    namecn: String,
    nameen: String,
    isDel: {
      type: Number,
      default: 0,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
    }, // 品牌
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

const BranchKindModel = mongoose.model("branch-kind", goodsSchema);

export default BranchKindModel;
