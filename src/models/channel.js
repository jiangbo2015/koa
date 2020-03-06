import mongoose from "mongoose"
import paginate from "mongoose-paginate"
import uniqueValidator from "mongoose-unique-validator"

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
		},
		styles: [
			{
				styleId: String,
				plainColors: Array,
				flowerColors: Array
			}
		]
	},
	{
		versionKey: false,
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" }
	}
)

channelSchema.plugin(uniqueValidator)
channelSchema.plugin(paginate)
const ChannelModel = mongoose.model("channels", channelSchema)

export default ChannelModel
