import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";


const favoriteSchema = new mongoose.Schema(
  {
    isDel: { type: Number,default: 0 }, 
    capsule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "capsule",
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

favoriteSchema.plugin(uniqueValidator);
favoriteSchema.plugin(paginate);

const favoriteModel = mongoose.model("favorite", favoriteSchema);

export default favoriteModel;
