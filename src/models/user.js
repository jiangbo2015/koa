import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";

const RoleToAuthority = {
    0 : 'admin',
    1 : 'productor',
    2 : 'designer',
    3 : 'customer',
    4 : 'customer2', // 原二级客户，现已废弃
    5 : 'graphicDesigner',
}


/**
 * role: 0-超级管理员，1-产品经理，2-视觉设计，3-用户
 */
const userSchema = new mongoose.Schema(
  {
    account: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    password: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "channels" },
    role: {
        type: Number,
        required: true,
        enum: [0, 1, 2, 3, 4, 5], // 0管理员 1产品经理  2设计人员  3产品代理 4客户 5美工
      },
    email: String,
    isDel: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

// userSchema.virtual("newRole").get(function() {
// 	return this.role
// })

userSchema.plugin(uniqueValidator);
userSchema.plugin(paginate);

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
