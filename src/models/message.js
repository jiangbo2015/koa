import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";


const messageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    objectModelId: { type: mongoose.Schema.Types.ObjectId },
    objectModel: { type: String, default: 'capsule'  },
    type: { 
        type: String, 
        enum: [
            'new-capsule-notice', // 胶囊上新通知
            'capsule-publishing-application', // 胶囊发布请求
            'capsule-published-notice' // 胶囊发布完成通知
        ], default: 'new-capsule-notice' 
    },
    coverImage: { type: String }, // 封面图 URL（可选）
    coverType: { type: String }, // 封面类型
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

messageSchema.plugin(uniqueValidator);
messageSchema.plugin(paginate);

const messageModel = mongoose.model("message", messageSchema);

export default messageModel;
