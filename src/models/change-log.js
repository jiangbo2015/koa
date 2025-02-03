import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";

const changeLogSchema = new mongoose.Schema(
  {
    model: String, // 修改的模型名称（如 "Color"）
    modelId: mongoose.Schema.Types.ObjectId, // 修改的文档 ID
    changes: [{
      field: String, // 修改的字段名称
      oldValue: mongoose.Schema.Types.Mixed, // 修改前的值
      newValue: mongoose.Schema.Types.Mixed, // 修改后的值
    }],
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // 修改人
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

changeLogSchema.plugin(uniqueValidator);
changeLogSchema.plugin(paginate);

const changeLogModel = mongoose.model("changeLog", changeLogSchema);

export default changeLogModel;
