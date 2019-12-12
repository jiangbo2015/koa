import mongoose from "mongoose"
const uniqueValidator = require("mongoose-unique-validator")

/**
 * 给某个款式下某个通道分配尺寸等信息
 */
const styleSchema = new mongoose.Schema(
	{
		styles: [
			{
				ref: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: "style"
					}
				],
				name: String
			}
		]
	},
	{
		versionKey: false,
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" }
	}
)

styleSchema.plugin(uniqueValidator)

const ChannelStyleModel = mongoose.model("test", styleSchema)

export default ChannelStyleModel
