import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import config from "../config"
import { response } from "../utils"
import User from "../models/user"
import Favorite from "../models/favorite"

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

/**
 * 兼容其他需要获取当前用户信息的地方，使用promise处理
 */
export const getCurrentUser = (ctx, next) => {
	return new Promise(async (resolve, reject) => {
		try {
			const account = verify(ctx.headers.authorization)
			const data = await User.findOne({ account })
			// .populate({
			// 	path: "channels"
			// })
			// .populate("channels")
			ctx.body = response(true, data)
			resolve(data)
		} catch (err) {
			ctx.body = response(false, null, err.message)
			reject(err)
		}
	})
}

export const add = async (ctx, next) => {
	try {
		const { account, password, role, name, channels, size } = ctx.request.body
		let user = new User({
			account,
			password,
			role,
			name,
			channels
			// channels: {
			// 	cid: channels.split(","),
			// 	size: 10
			// }
		})
		let data = await user.save()
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const update = async (ctx, next) => {
	try {
		const { _id, ...others } = ctx.request.body
		let data = await User.update(
			{ _id },
			others
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
		const { role } = ctx.request.query
		let data = await User.find({
			role
		}).populate({
			path: "channels"
		})
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const addFavorite = async (ctx, next) => {
	try {
		const { styleAndColor } = ctx.request.body
		// console.log(styleAndColor)
		const currentUser = await getCurrentUser(ctx)
		// let data = await User.findOneAndUpdate(
		// 	{
		// 		account: currentUser.account
		// 	},
		// 	{
		// 		$push: {
		// 			favorites: { styleAndColor }
		// 		}
		// 	}
		// )
		const favorite = new Favorite({
			user: currentUser._id,
			styleAndColor
		})
		let data = await favorite.save()
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const updateFavorite = async (ctx, next) => {
	try {
		const { _id, styleAndColor } = ctx.request.body
		const currentUser = await getCurrentUser(ctx)
		let data = await User.findOneAndUpdate(
			{
				account: currentUser.account,
				"favorites._id": _id
			},
			{
				$set: {
					"favorites.$.styleAndColor": styleAndColor
				}
			},
			{
				new: true
			}
		)
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const deleteFavorite = async (ctx, next) => {
	try {
		const { _id } = ctx.request.body
		const currentUser = await getCurrentUser(ctx)
		let data = await User.findOneAndUpdate(
			{
				account: currentUser.account
			},
			{
				$pull: {
					favorites: {
						_id
					}
				}
			}
		)
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

const formatColors = datas => {
	datas.map(p => {
		p.value = p.colorId.value
		p.code = p.colorId.code
		p.type = p.colorId.type
		p.colorId = p.colorId._id
		delete p._id
	})
}
const formatFavorite = datas => {
	return datas.map((item, i) => {
		item.styleAndColor.map((sc, j) => {
			sc.style = sc.styleId
			sc.color = sc.colorId

			// 处理colorId
			formatColors(sc.style.plainColors)
			formatColors(sc.style.flowerColors)

			// 删除多余对象
			delete sc.styleId
			delete sc.colorId

			return sc
		})
		return item
	})
}
export const getNewFavoriteList = async (ctx, next) => {
	try {
		const currentUser = await getCurrentUser(ctx)
		let data = await User.findById({
			// account: currentUser.account
			_id: currentUser._id
		})
			.populate({
				path: "favorites.styleAndColor.styleId",
				model: "style",
				populate: {
					path: "plainColors.colorId flowerColors.colorId size"
				}
			})
			.populate("favorites.styleAndColor.colorId")
			.select("favorites -_id")
		// .lean()
		data = data.toJSON()

		ctx.body = response(true, formatFavorite(data.favorites))
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getFavoriteList = async (ctx, next) => {
	try {
		const currentUser = await getCurrentUser(ctx)
		let data = await Favorite.find({
			user: currentUser._id
		})
			.populate({
				path: "styleAndColor.styleId",
				model: "style",
				populate: {
					path: "plainColors.colorId flowerColors.colorId size"
				}
			})
			.populate("styleAndColor.colorId")
			.lean()

		ctx.body = response(true, formatFavorite(data))
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
