import mongoose from "mongoose"
import uniqueValidator from "mongoose-unique-validator"
const hide = require("mongoose-hidden")()

/**
 * role: 0-超级管理员，1-产品经理，2-视觉设计，3-用户
 */
const userSchema = new mongoose.Schema(
	{
		account: {
			type: String,
			required: true,
			unique: true
		},
		name: { type: String, required: true },
		password: { type: String, required: true, hide: true },
		email: String,
		address: String,
		remark: String,
		contact: String,
		phone: String,
		customerType: String,
		role: {
			type: Number,
			required: true,
			enum: [0, 1, 2, 3]
		},
		channels: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "channels"
			}
		],
		favorites: [
			{
				styleAndColor: [
					{
						styleId: {
							type: mongoose.Schema.Types.ObjectId,
							ref: "style"
						},
						colorId: String
					}
				]
			}
		]
	},
	{
		versionKey: false,
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" }
	}
)

userSchema.plugin(uniqueValidator)
userSchema.plugin(hide)

const UserModel = mongoose.model("users", userSchema)

export default UserModel
