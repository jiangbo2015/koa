import mongoose from "mongoose"
import paginate from "mongoose-paginate"
import uniqueValidator from "mongoose-unique-validator"

/**
 * role: 0-超级管理员，1-产品经理，2-视觉设计，3-用户
 */
const userSchema = new mongoose.Schema(
	{
		account: {
			type: String,
			required: true,
			unique: true,
		},
		name: { type: String, required: true },
		password: { type: String, required: true },
		email: String,
		address: String,
		remark: String,
		contact: String,
		phone: String,
		customerType: String,
		countries: String,
		shippingcountries: String,
		shippingaddress: String,
		postcode: String,
		shippingpostcode: String,
		dutyparagraph: String,
		currency: {
			type: Number,
			enum: [0, 1, 2],
			default: 0,
		},
		role: {
			type: Number,
			required: true,
			enum: [0, 1, 2, 3],
		},
		selectFavorites: Array,
		channels: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "channels",
			},
		],
		goods: [{ type: mongoose.Schema.Types.ObjectId, ref: "goods" }],
		// favorites: [
		// 	{
		// 		styleAndColor: [
		// 			{
		// 				styleId: {
		// 					type: mongoose.Schema.Types.ObjectId,
		// 					ref: "style"
		// 				},
		// 				colorId: {
		// 					type: mongoose.Schema.Types.ObjectId,
		// 					ref: "color"
		// 				}
		// 			}
		// 		]
		// 	}
		// ]
	},
	{
		versionKey: false,
		timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
		toObject: {
			virtuals: true,
		},
		toJSON: {
			virtuals: true,
		},
	}
)

// userSchema.virtual("newRole").get(function() {
// 	return this.role
// })

userSchema.plugin(uniqueValidator)
userSchema.plugin(paginate)

const UserModel = mongoose.model("users", userSchema)

export default UserModel
