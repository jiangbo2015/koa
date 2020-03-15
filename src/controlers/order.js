import Order from "../models/order"
import User from "../models/user"
import System from "../models/system"
import { response } from "../utils"
import { getCurrentUser } from "./user"
import mongoose from "mongoose"
import json2xls from "json2xls"
import fs from "fs"
import path from "path"
import Mail from "../utils/mail"

export const add = async (ctx, next) => {
	try {
		const currentUser = await getCurrentUser(ctx)
		const body = ctx.request.body
		console.log("order", body)
		body.user = currentUser._id
		let order = new Order(body)
		const data = await order.save()

		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const update = async (ctx, next) => {
	try {
		const { _id, ...others } = ctx.request.body

		const data = await Order.findByIdAndUpdate({ _id }, others)

		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const clear = async (ctx, next) => {
	try {
		let data = await Order.deleteMany()

		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getMyList = async (ctx, next) => {
	try {
		const currentUser = await getCurrentUser(ctx)
		const { isSend } = ctx.request.query
		const q = {
			user: mongoose.Types.ObjectId(currentUser._id)
		}
		if (typeof isSend !== "undefined") {
			q.isSend = isSend
		}
		const data = await Order.find(q)
			.populate({
				path: "orderData.favorite",
				populate: "styleAndColor.styleId styleAndColor.colorIds"
			})
			.populate("user")
			.lean()

		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getList = async (ctx, next) => {
	try {
		const currentUser = await getCurrentUser(ctx)
		let data
		// 1是产品经理
		if (currentUser.role === 1) {
			const users = await User.find({
				channels: {
					$in: currentUser.channels
				},
				role: 3
			})
			let uids = []
			users.find(x => uids.push(x._id))
			console.log(uids, "uids", currentUser.channels)
			data = await Order.find({
				user: {
					$in: uids
				}
			})
		} else {
			data = await Order.find()
		}
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const detail = async (ctx, next) => {
	try {
		const { _id } = ctx.request.query
		const data = await Order.findById({ _id })
			.populate({
				path: "orderData.favorite",
				populate: "styleAndColor.styleId styleAndColor.colorIds"
			})
			.populate("user")
			.lean()
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const del = async (ctx, next) => {
	try {
		const { _id } = ctx.request.body
		const data = await Order.findByIdAndDelete({ _id })
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const send = async (ctx, next) => {
	try {
		const { list } = ctx.request.body
		// const { email } = await System.find()[0]
		const data = await Order.updateMany(
			{
				_id: {
					$in: list
				}
			},
			{
				$set: {
					isSend: 1
				}
			}
		)
		// const html = `<div><h1>新订单<h1/><a href="https://www.baidu.com">订单链接</a></div>`
		// Mail(html, "bo.jiang@miaocode.com")

		ctx.body = response(true, {}, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

const writeFile = json => {
	var xls = json2xls(json)
	let relativePath = "xlsx/data.xlsx"
	let absPath = path.join(__dirname, "../public/" + relativePath)
	fs.writeFileSync(absPath, xls, "binary")
	return relativePath
}

export const download = async (ctx, next) => {
	try {
		var json = {
			foo: "bar",
			qux: "moo",
			poo: 123,
			stux: new Date()
		}
		const { _id } = ctx.request.query
		const data = await Order.findById({ _id })
			.populate({
				path: "user"
			})
			.populate({
				path: "orderData.favoriteId"
			})
			.lean()
		// const relativePath = writeFile(json)

		// const data = await Order.find()
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}
