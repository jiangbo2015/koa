import Order from "../models/order"
import User from "../models/user"
import System from "../models/system"
import { response } from "../utils"
import { getCurrentUser } from "./user"
import mongoose from "mongoose"
import json2xls from "json2xls"
import fs from "fs"
import koaSend from "koa-send"
import path from "path"
import xl from "excel4node"
import _ from "lodash"

import Mail from "../utils/mail"
import moment from "moment"

export const add = async (ctx, next) => {
	try {
		const currentUser = await getCurrentUser(ctx)
		const body = ctx.request.body

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
			user: mongoose.Types.ObjectId(currentUser._id),
			isDel: 0,
		}
		if (typeof isSend !== "undefined") {
			q.isSend = isSend
		}
		const data = await Order.find(q)
			.sort({ createTime: -1 })
			.populate({
				path: "orderData.items.favorite",
				populate: "styleAndColor.styleId styleAndColor.colorIds",
			})
			.populate("orderData.size")
			.populate("user")

			.lean()

		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const getList = async (ctx, next) => {
	try {
		const { userId } = ctx.request.query
		let q = {
			isDel: 0,
		}
		if (userId) {
			q.user = userId
		}
		const currentUser = await getCurrentUser(ctx)

		// 1是产品经理
		let data = await Order.find(q)
			.sort({ createTime: -1 })
			.populate({
				path: "orderData.items.favorite",
				populate: "styleAndColor.styleId styleAndColor.colorIds",
			})
			.populate("orderData.size")
			.populate("user")

		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

// 管理系统获取订单列表
export const getAllList = async (ctx, next) => {
	try {
		const { orderNo, userName } = ctx.request.query
		let q = {
			isSend: 1,
			isDel: 0,
		}
		let data = {}

		if (orderNo) {
			q._id = orderNo
			await Order.find(q).sort({ createTime: -1 }).populate("user")
		} else {
			if (userName) {
				const res = await User.findOne({
					name: userName,
				})
				q.user = res ? res._id : null
			}
			data = await Order.find(q).sort({ createTime: -1 }).populate("user")
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
				path: "orderData.items.favorite",
				populate: "styleAndColor.styleId styleAndColor.colorIds",
			})
			.populate("user")
			.populate("orderData.size")
			.lean()
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const del = async (ctx, next) => {
	try {
		const { _id } = ctx.request.body
		const data = await Order.findById({ _id })
		if (data.isSend === 1) {
			await Order.findByIdAndUpdate({ _id }, { isDel: 1 })
		} else {
			await Order.findByIdAndDelete({ _id })
		}
		ctx.body = response(true, data, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

export const send = async (ctx, next) => {
	try {
		const { list } = ctx.request.body

		let date = moment().format("YYYYMMDD")

		// body.orderNo = orderNo
		// body.date = date
		if (list.length < 1) return
		let now = await Order.findById({ _id: list[0] })
		let total = (await Order.find({ date })).length + 1
		let length = (total + "").length
		let zero = new Array(4 - length).fill(0).join("")
		let orderNo = `MM${date}${zero}${total}`
		now.isSend = 1
		now.date = date
		now.orderNo = now.orderGoodNo + orderNo
		for (let i = 1; i < list.length; i++) {
			let other = await Order.findById({ _id: list[i] })
			now.orderData.push(...other.orderData)
			await Order.findByIdAndDelete({ _id: list[i] })
		}
		await now.save()
		// const data = await Order.updateMany(
		// 	{
		// 		_id: {
		// 			$in: list
		// 		}
		// 	},
		// 	{
		// 		$set: {
		// 			isSend: 1
		// 		}
		// 	}
		// )
		const res = await System.find()
		console.log(res[0])
		const { email } = res[0]
		if (!email) {
			ctx.body = response(false, {}, "邮箱不存在")
			return
		}
		let hrefs = ""
		list.map(
			(x) =>
				(hrefs += `<h3><a href="http://8.209.64.159:4000/download?id=${x}">订单链接</a></h3>`)
		)
		const html = `<div><h1>您有新的订单<h1/>${hrefs}</div>`
		Mail(html, email)

		ctx.body = response(true, {}, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}

const writeFile = (json) => {
	var xls = json2xls(json)
	let relativePath = "xlsx/data.xlsx"
	let absPath = path.join(__dirname, "../public/" + relativePath)
	fs.writeFileSync(absPath, xls, "binary")
	return relativePath
}

export const download = async (ctx, next) => {
	console.log("download")
	try {
		const { _id, rateSign, rateVal } = ctx.request.query
		const order = await Order.findById({ _id })
			.populate({
				path: "user",
			})
			.populate({
				path: "orderData.favoriteId",
			})
			.lean()
		let maxSize = 1
		order.orderData.map((o) => {
			let itemMax = _.maxBy(o.items, (i) => i.sizeInfo.length)
			maxSize =
				maxSize > itemMax.sizeInfo.length ? maxSize : itemMax.sizeInfo.length
		})
		console.log("maxSize", maxSize)
		// Create a new instance of a Workbook class
		let wb = new xl.Workbook()

		// Add Worksheets to the workbook
		let ws = wb.addWorksheet("Sheet 1")

		// Head
		ws.cell(1, 1).string("")
		ws.cell(1, 2).string("样衣编号")
		ws.cell(1, 3).string("颜色")
		ws.cell(1, 4).string("款式图")
		ws.cell(1, 5, 1, 5 + maxSize, true).string("尺码/配比")
		ws.cell(1, 6 + maxSize).string("中包数")
		ws.cell(1, 7 + maxSize).string("箱数")
		ws.cell(1, 8 + maxSize).string("件数")
		ws.cell(1, 9 + maxSize).string(`单价/${rateSign}`)
		ws.cell(1, 10 + maxSize).string(`总价/${rateSign}`)

		let row = 1
		order.orderData.map((groupData) => {
			// Insert Size
			row++
			groupData.size.values.map((v, vIndex) => {
				ws.cell(row, 5 + vIndex).string(v.name)
			})
			row++
			groupData.items.map((item, itemIndex) => {
				let styleNos = item.favorite.styleAndColor
					.map((x) => x.styleId.styleNo)
					.toString()

				let colorCodes = item.favorite.styleAndColor
					.map((x) => x.colorIds.map((c) => c.code).toString())
					.toString()
				ws.cell(row, 1).number(itemIndex + 1)
				ws.cell(row, 2).string(styleNos)
				ws.cell(row, 3).string(colorCodes)
				ws.cell(row, 4)
					.string("款式图")
					.link(
						`https://we-idesign.com/demo?id=${item.favorite._id}&rid=${order._id}`
					)
				let allSizeSum = 0
				item.sizeInfo.map((v, index) => {
					ws.cell(row, 5 + index).number(v)
					allSizeSum += v
				})
				ws.cell(row, 5 + maxSize).number(item.packageCount)
				ws.cell(row, 6 + maxSize).number(item.cnts)
				ws.cell(row, 7 + maxSize).number(
					allSizeSum * item.cnts * item.packageCount
				)
				let prices = item.favorite.styleAndColor
					.map((x) => x.styleId.price * rateVal)
					.toString()
				ws.cell(row, 6 + maxSize).number(prices)
			})
		})
		// const relativePath = writeFile(json)

		// const data = await Order.find()

		ctx.body = response(true, {}, "成功")
	} catch (err) {
		ctx.body = response(false, null, err.message)
	}
}
