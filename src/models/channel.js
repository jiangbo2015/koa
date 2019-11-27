import mongoose from "mongoose"

/**
 * currency: 0-人民币，1-美元，2-欧元
 */
const channelSchema = new mongoose.Schema(
	{
		name: String,
		code: String,
		currency: Number
	},
	{
		versionKey: false
	}
)

const ChannelModel = mongoose.model("channels", channelSchema)

export default ChannelModel
