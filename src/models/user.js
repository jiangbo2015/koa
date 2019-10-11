import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
	{
		phone: String,
		password: String,
		products: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "products"
			}
		]
	},
	{
		versionKey: false
	}
)

const UserModel = mongoose.model("users", userSchema)

export default UserModel
