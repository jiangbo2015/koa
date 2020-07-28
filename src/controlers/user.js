import jwt from "jsonwebtoken"
import Channel from "../models/channel"
import config from "../config"
import { response } from "../utils"
import User from "../models/user"
import Favorite from "../models/favorite"
import System from "../models/system"
import Mail from "../utils/mail"
import path from "path"
import fs from "fs"
import json2xls from "json2xls"

/**
 * 获取token中的值
 * @param {*} token
 */
const verify = (token) => jwt.verify(token.split(" ")[1], config.secret)

export const login = async (ctx, next) => {
	const { account, password } = ctx.request.body
	try {
		const data = await User.findOne({ account, password }).lean()
		if (!data) {
			ctx.body = response(false, null, "用户名或密码错误")
		} else {
			let token = jwt.sign(account, config.secret)

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
			if (data.role === 3) {
				let res = await Channel.findById({ _id: data.channels[0] })
				if (res && res.currency) {
					data.currency = res.currency
				}
			}

			ctx.body = response(true, data)
			resolve(data)
		} catch (err) {
			ctx.body = response(false, null, err.message)
			reject(err)
		}
	})
}

export const getCurrentUserDetail = (ctx, next) => {
	return new Promise(async (resolve, reject) => {
		try {
			const account = verify(ctx.headers.authorization)
			const data = await User.findOne({ account }).populate({
				path: "channels",
				// select: "-styles"
			})

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
					select: "-styles",
				})
				.lean()

			const users = await User.find({
				channels: {
					$in: channels,
				},
				role: 3,
				_id: {
					$ne: _id,
				},
			}).populate({
				path: "channels",
				select: "-styles",
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
		const {
			account,
			password,
			role,
			name,
			channels,
			...others
		} = ctx.request.body
		let user = new User({
			account,
			password,
			role,
			name,
			channels,
			...others,
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
		let data = await User.paginate(q, {
			page,
			limit: parseInt(limit),
			populate: "channels",
		})
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
				$in: currentUser.channels,
			},
		}).populate({
			path: "channels",
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
			styleAndColor,
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
				_id: currentUser._id,
			},
			{
				selectFavorites: (currentUser.selectFavorites || []).concat(_id),
			}
		)
		const newFav = new Favorite({
			user: currentUser._id,
			styleAndColor: favorite.styleAndColor,
			extend: _id,
		})
		let data = await newFav.save()
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const deleteSelectFavorite = async (ctx, next) => {
	try {
		const { _id } = ctx.request.body

		let data = await Favorite.findByIdAndDelete({ _id })
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
				$in: currentUser.selectFavorites,
			},
		}).select("_id")
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const updateFavorite = async (ctx, next) => {
	try {
		const { _id, styleAndColor } = ctx.request.body
		const currentUser = await getCurrentUser(ctx)
		await Favorite.findByIdAndUpdate(
			{
				_id,
			},
			{
				$set: {
					isDel: 1,
				},
			}
		)

		const favorite = new Favorite({
			user: currentUser._id,
			styleAndColor,
		})
		let data = await favorite.save()

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
				_id,
			},
			{
				$set: {
					isDel: 1,
				},
			}
		)
		ctx.body = response(true, data)
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getFavoriteList = async (ctx, next) => {
	try {
		const { goodsId } = ctx.request.query
		const currentUser = await getCurrentUser(ctx)
		let data = await Favorite.find({
			user: currentUser._id,
			isDel: 0,
		})
			.populate({
				path: "styleAndColor.style",
				model: "style",
				populate: {
					path: "plainColors.colorId flowerColors.colorId size",
				},
			})
			.populate("styleAndColor.colorIds")
			// .lean()
			.exec()
		// data = data.toJSON()
		data = JSON.parse(JSON.stringify(data))

		if (goodsId) {
			console.log("goodsId", goodsId)
			data = data.filter((x) =>
				x.styleAndColor.some((y) => y.style.goodsId.indexOf(goodsId) >= 0)
			)
		}

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
				$in: currentUser.channels,
			},
			_id: {
				$ne: currentUser._id,
			},
		})
		let uids = []
		users.map((x) => uids.push(x._id))
		// let channels = []
		// console.log(currentUser.channels, "currentUser channels")
		// users.map(x => channels.push(x.channels))
		// console.log("uids--", uids, channels)
		let data = await Favorite.find({
			user: {
				$in: uids,
			},
			isDel: 0,
		})
			.populate({
				path: "styleAndColor.style",
				model: "style",
				populate: {
					path: "plainColors.colorId flowerColors.colorId size",
				},
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
				isDel: 0,
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

export const feedback = async (ctx, next) => {
	try {
		const { body } = ctx.request
		const res = await System.find()
		const { email } = res[0]
		if (!email) {
			ctx.body = response(false, {}, "邮箱不存在")
			return
		}
		let html = ""
		const keys = Object.keys(body)
		keys.map((x) => (html += `<div>${body[x]}</div>`))

		Mail(html, email)
		ctx.body = response(true, {})
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

const writeFile = (json) => {
	var xls = json2xls(json)
	let relativePath = "xlsx/客户数据.xlsx"
	let absPath = path.join(__dirname, "../public/" + relativePath)
	fs.writeFileSync(absPath, xls, "binary")
	return relativePath
}
export const download = async (ctx, next) => {
	try {
		const data = await User.find({ role: 3 })
		const channels = await Channel.find()
		const json = data.map((x) => ({
			账号: x.account,
			姓名: x.name,
			密码: x.password,
			邮箱: x.email,
			联系人: x.contact,
			电话: x.phone,
			税号: x.dutyparagraph,
			所属通道: (
				channels.find((c) => String(c._id) == String(x.channels[0])) || {}
			).name,
			地址: `${x.countries}-${x.address}(${x.postcode})`,
			托运地址: `${x.shippingcountries}-${x.shippingaddress}(${x.shippingpostcode})`,
			备注: x.remark,

			// channel: x.channels[0]
			// contact: x.contact,
		}))
		const relativePath = writeFile(json)

		ctx.body = response(true, {
			url: relativePath,
			channels,
		})
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}
