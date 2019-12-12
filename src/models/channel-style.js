import mongoose from "mongoose"
const uniqueValidator = require("mongoose-unique-validator")

/**
 * 给某个款式下某个通道分配尺寸等信息
 */
const styleSchema = new mongoose.Schema(
	{
		channelId: String,
		styleId: String,
		sizeIds: Array,
		plainColorIds: Array,
		flowerColorIds: Array
	},
	{
		versionKey: false,
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" }
	}
)

styleSchema.plugin(uniqueValidator)

const ChannelStyleModel = mongoose.model("channel-style", styleSchema)

export default ChannelStyleModel
