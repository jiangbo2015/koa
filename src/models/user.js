import mongoose from "mongoose"
var uniqueValidator = require("mongoose-unique-validator")

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
		password: { type: String, required: true },
		role: {
			type: Number,
			required: true
		},
		channels: {
			type: Array
		}
	},
	{
		versionKey: false
	}
)

userSchema.plugin(uniqueValidator)

const UserModel = mongoose.model("users", userSchema)

export default UserModel
