import mongoose from "mongoose";
import paginate from "mongoose-paginate";
import uniqueValidator from "mongoose-unique-validator";

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
    email: String,
    address: String,
    companyAddress1: String,
    companyAddress2: String,
    companyPostcode: String,
    companyCity: String,
    companyCountry: String,

    shippingAddress1: String,
    shippingAddress2: String,
    shippingPostcode: String,
    shippingCity: String,
    shippingCountry: String,

    bankAccount: String,
    remark: String,
    payType: String,
    contact: String, //联系人
    companyFullName: String,
    webside: String,
    VATNo: String, //增值税号码
    phone: String,
    telephone: String,
    businessAgent: String, //所属商业代理
    customerType: String,
    countries: String,
    shippingcountries: String,
    shippingaddress: String,
    postcode: String,
    shippingpostcode: String,
    dutyparagraph: String,
    type: {
      type: Number,
      enum: [1, 2, 3, 4, 5], // 1零售店  2百货  3连锁店  4网店  5其它
      default: 5,
    },
    currency: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
    role: {
      type: Number,
      required: true,
      enum: [0, 1, 2, 3, 4], // 0管理员 1产品经理  2设计人员  3产品代理 4客户
    },
    selectFavorites: Array,
    channels: [
      {
        codename: String,
        assignedId: String,
        channel: { type: mongoose.Schema.Types.ObjectId, ref: "channel" },
        empower: {
          type: Boolean,
          default: false,
        },
      },
    ],
    channelEmpowerUserd: {
      type: Boolean,
      default: false,
    },
    innerDataUserd: {
      type: Boolean,
      default: false,
    },
    businessUserd: {
      type: Boolean,
      default: false,
    },
    isDel: {
      type: Number,
      default: 0,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    goods: [{ type: mongoose.Schema.Types.ObjectId, ref: "goods" }],
    branchs: [{ type: mongoose.Schema.Types.ObjectId, ref: "branch" }],
    capsules: [{ type: mongoose.Schema.Types.ObjectId, ref: "capsule" }],
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
