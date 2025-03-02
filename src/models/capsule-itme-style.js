import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";


const capsuleItmeStyleSchema = new mongoose.Schema(
  {
    isDel: { type: Number,default: 0 }, 
    capsuleItmeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "capsuleItmeStyle",
    },
    imgUrl: {
        type: String,
        required: true,
      },
    imgUrlBack: {
        type: String,
        required: true,
    },
    colorIds: [ { type: mongoose.Schema.Types.ObjectId, ref: "color" } ]
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

capsuleItmeStyleSchema.plugin(uniqueValidator);
capsuleItmeStyleSchema.plugin(paginate);

const capsuleItmeStyleModel = mongoose.model("capsuleItmeStyle", capsuleItmeStyleSchema);

export default capsuleItmeStyleModel;
