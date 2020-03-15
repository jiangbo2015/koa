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
			// 	path: "channels",
			// 	select: "-styles"
			// })

			ctx.body = response(true, data)
			resolve(data)
		} catch (err) {
			ctx.body = response(false, null, err.message)
			reject(err)
		}
	})
}

export const getUserChannels = (ctx, next) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { account, channels, _id } = await getCurrentUser(ctx)
			const data = await User.findOne({ account })
				.populate({
					path: "channels",
					select: "-styles"
				})
				.lean()

			const users = await User.find({
				channels: {
					$in: channels
				},
				role: 3,
				_id: {
					$ne: _id
				}
			}).populate({
				path: "channels",
				select: "-styles"
			})
			data.users = users

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
		let data = await User.findByIdAndUpdate(
			{ _id },
			others
			// {
			// 	$addToSet: {
			// 		products: productId
			// 	}
			// }
		)

		ctx.body = response(true, {})
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

/**
 * 注意对数组形式的字段进行查询的处理
 */
export const getList = async (ctx, next) => {
	try {
		const { role, page = 1, limit = 20 } = ctx.request.query
		let q = {}
		if (typeof role !== "undefined") {
			q.role = role
		}
		let data = await User.paginate(q, { page, limit, populate: "channels" })
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getOwnList = async (ctx, next) => {
	try {
		// const { role } = ctx.request.query
		const currentUser = await getCurrentUser(ctx)
		let data = await User.find({
			role: 3,
			channels: {
				$in: currentUser.channels
			}
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
		const currentUser = await getCurrentUser(ctx)
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

export const addSelectFavorite = async (ctx, next) => {
	try {
		const { _id } = ctx.request.body
		const currentUser = await getCurrentUser(ctx)
		const favorite = await Favorite.findById({ _id })
		await User.findByIdAndUpdate(
			{
				_id: currentUser._id
			},
			{
				selectFavorites: (currentUser.selectFavorites || []).concat(_id)
			}
		)
		const newFav = new Favorite({
			user: currentUser._id,
			styleAndColor: favorite.styleAndColor,
			extend: _id
		})
		let data = await newFav.save()
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getMySelectFavorite = async (ctx, next) => {
	try {
		const currentUser = await getCurrentUser(ctx)

		const data = await Favorite.find({
			_id: {
				$in: currentUser.selectFavorites
			}
		}).select("_id")
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const updateFavorite = async (ctx, next) => {
	try {
		const { _id, styleAndColor } = ctx.request.body

		let data = await Favorite.findOneAndUpdate(
			{
				_id
			},
			{
				styleAndColor
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
		let data = await Favorite.findByIdAndUpdate(
			{
				_id
			},
			{
				$set: {
					isDel: 1
				}
			}
		)
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getFavoriteList = async (ctx, next) => {
	try {
		const currentUser = await getCurrentUser(ctx)
		let data = await Favorite.find({
			user: currentUser._id,
			isDel: 0
		})
			.populate({
				path: "styleAndColor.style",
				model: "style",
				populate: {
					path: "plainColors.colorId flowerColors.colorId size"
				}
			})
			.populate("styleAndColor.colorIds")
			// .lean()
			.exec()
		// data = data.toJSON()
		data = JSON.parse(JSON.stringify(data))

		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const selectFavoriteList = async (ctx, next) => {
	try {
		const currentUser = await getCurrentUser(ctx)
		const users = await User.find({
			channels: {
				$in: currentUser.channels
			},
			_id: {
				$ne: currentUser._id
			}
		})
		let uids = []
		users.map(x => uids.push(x._id))
		// let channels = []
		// console.log(currentUser.channels, "currentUser channels")
		// users.map(x => channels.push(x.channels))
		// console.log("uids--", uids, channels)
		let data = await Favorite.find({
			user: {
				$in: uids
			},
			isDel: 0
		})
			.populate({
				path: "styleAndColor.style",
				model: "style",
				populate: {
					path: "plainColors.colorId flowerColors.colorId size"
				}
			})
			.populate("styleAndColor.colorIds")
			// .lean()
			.exec()
		// data = data.toJSON()
		data = JSON.parse(JSON.stringify(data))

		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const updateMany = async (ctx, next) => {
	try {
		let data = await Favorite.updateMany(
			{},
			{
				isDel: 0
			}
		)
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
