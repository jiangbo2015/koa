import mongoose from "mongoose"

const channelSchema = new mongoose.Schema(
	{
		name: String,
		code: String
	},
	{
		versionKey: false
	}
)

const ChannelModel = mongoose.model("channels", channelSchema)

export default ChannelModel
