import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import config from "../config"
import { response } from "../utils"
import User from "../models/user"

/**
 * 获取token中的值
 * @param {*} token
 */
const verify = token => jwt.verify(token.split(" ")[1], config.secret)

export const login = async (ctx, next) => {
	const { account } = ctx.request.body
	try {
		const data = await User.findOne({ account }).lean()
		if (!data) {
			ctx.body = response(false, null, "用户名或密码错误")
		} else {
			let token = jwt.sign(account, config.secret)
			console.log(token)
			ctx.body = response(true, { ...data, token })
		}
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getCurrentUser = async (ctx, next) => {
	try {
		console.log(verify(ctx.headers.authorization))
		const { account } = ctx.headers.authorization
		const data = await User.findOne({ account })
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const add = async (ctx, next) => {
	try {
		const { account, password, role, name, channels, size } = ctx.request.body
		let user = new User({
			account,
			password,
			role,
			name,
			// channels: channels ? channels.split(",") : []
			channels: {
				cid: channels.split(","),
				size: 10
			}
		})
		let data = await user.save()
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const update = async (ctx, next) => {
	try {
		const { _id, channels = "", ...others } = ctx.request.body
		console.log("channels:", channels)
		let data = await User.update(
			{ _id },
			{
				channels: channels ? channels.split(",") : [],
				...others
			}
			// {
			// 	$addToSet: {
			// 		products: productId
			// 	}
			// }
		)

		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

/**
 * 注意对数组形式的字段进行查询的处理
 */
export const getList = async (ctx, next) => {
	try {
		let data = await User.find({
			// channels: "5de9b31193dee4af1da163c8"
		}).populate({
			path: "channels"
		})
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const deleteById = async (ctx, next) => {
	try {
		const { _id } = ctx.request.body
		let data = await User.remove({ _id })
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

// export const getList2 = async (ctx, next) => {
// 	try {
// 		// 查询所有用户，并选择phone字段，不包括_id字段
// 		// let data = await User.find(null, "phone -_id")
// 		let data = await User.find()
// 			.populate({
// 				path: "products",
// 				match: {
// 					price: { $gt: 50 }
// 				},
// 				select: "name price -_id" //products表选择的field
// 			})
// 			.select("phone -_id") //users表选择的field

// 		ctx.body = response(true, data)
// 	} catch (err) {
// 		ctx.body = response(false, null, err.message)
// 	}
// }

// export const getUserByRef = async (ctx, next) => {
// 	try {
// 		let data = await User.find()
// 		ctx.body = response(true, data)
// 	} catch (err) {
// 		ctx.body = response(false, null, err.message)
// 	}
// }

// export const deleteMany = async (ctx, next) => {
// 	try {
// 		let data = await User.deleteMany()
// 		ctx.body = response(true, data)
// 	} catch (err) {
// 		ctx.body = response(false, null, err.message)
// 	}
// }

// export const getUserById = async (ctx, next) => {
// 	try {
// 		const { id } = ctx.request.query
// 		let data = await User.findById({ _id: id })
// 		ctx.body = response(true, data)
// 	} catch (err) {
// 		ctx.body = response(false, null, err.message)
// 	}
// }

// export const aggregate = async (ctx, next) => {
// 	try {
// 		const { uid, phone } = ctx.request.query
// 		let data = await User.aggregate([
// 			// {
// 			// 	$match: {
// 			// 		// _id: mongoose.Types.ObjectId(uid)
// 			// 		phone: {
// 			// 			$regex: /''/
// 			// 		}
// 			// 	}
// 			// },
// 			{
// 				$lookup: {
// 					from: "products",
// 					localField: "_id",
// 					foreignField: "uid",
// 					as: "products"
// 				}
// 			},
// 			{
// 				$project: {
// 					products: {
// 						name: 1
// 					},
// 					product: {
// 						// name: 1,
// 						// $slice: ["$products", 2]
// 						$slice: [[{ name: "good" }, { name: "bad" }, { name: "middle" }], 2]
// 					},
// 					phone: 1,
// 					num: {
// 						$size: "$products"
// 					},
// 					total: {
// 						$sum: "$products.price"
// 					}
// 				}
// 			}
// 		])
// 		ctx.body = response(true, data)
// 	} catch (err) {
// 		ctx.body = response(false, null, err.message)
// 	}
// }
