import mongoose from "mongoose"
const uniqueValidator = require("mongoose-unique-validator")

const systemSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			unique: true,
			required: true
		}
	},
	{
		versionKey: false,
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" }
	}
)

systemSchema.plugin(uniqueValidator)

const systemModel = mongoose.model("system", systemSchema)

export default systemModel
