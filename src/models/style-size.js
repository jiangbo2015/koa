import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const styleSizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

styleSizeSchema.plugin(uniqueValidator);
const styleSizeSModel = mongoose.model("style-size", styleSizeSchema);

export default styleSizeSModel;
