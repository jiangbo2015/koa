import mongoose from "mongoose"
const uniqueValidator = require("mongoose-unique-validator")

/**
 * currency: 0-人民币，1-美元，2-欧元
 */
const channelSchema = new mongoose.Schema(
	{
		name: String,
		code: {
			type: String,
			required: true,
			unique: true
		},
		currency: {
			type: Number,
			required: true,
			enum: [0, 1, 2]
		}
	},
	{
		versionKey: false,
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" }
	}
)

channelSchema.plugin(uniqueValidator)

const ChannelModel = mongoose.model("channels", channelSchema)

export default ChannelModel
