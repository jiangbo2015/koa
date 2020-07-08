import mongoose from "mongoose"
const uniqueValidator = require("mongoose-unique-validator")

const helpfilesSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		url: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
	}
)

helpfilesSchema.plugin(uniqueValidator)
const helpfilesModel = mongoose.model("helpfiles", helpfilesSchema)

export default helpfilesModel
