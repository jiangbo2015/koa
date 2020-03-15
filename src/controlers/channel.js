import Channel from "../models/channel"
import Color from "../models/color"
import { response } from "../utils"

/**导出excel */
// var json2xls = require("json2xls")
// import fs from "fs"
// var xls = json2xls(data)
// fs.writeFileSync("data.xlsx", xls, "binary")

export const add = async (ctx, next) => {
	try {
		const body = ctx.request.body
		let channel = new Channel(body)
		let data = await channel.save()
		ctx.body = response(true, data)
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const getList = async (ctx, next) => {
	const { page = 1, limit = 20 } = ctx.request.query
	try {
		let data = await Channel.paginate({}, { page, limit })
		ctx.body = response(true, data)
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const del = async (ctx, next) => {
	try {
		const { _id } = ctx.request.body
		let data = await Channel.deleteOne({ _id })
		ctx.body = response(true, data)
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const update = async (ctx, next) => {
	try {
		const { _id, ...others } = ctx.request.body
		let data = await Channel.findByIdAndUpdate({ _id }, others)
		ctx.body = response(true, data)
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const findAll = async (ctx, next) => {
	try {
		let data = await Channel.find()
		ctx.body = response(true, data)
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const findById = async (ctx, next) => {
	try {
		const { _id } = ctx.request.query
		let data = await Channel.findById({ _id })
		ctx.body = response(true, data)
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const assign = async (ctx, next) => {
	try {
		const { channelId, styleId, plainColor, flowerColor } = ctx.request.body
		let res = await Channel.findById({ _id: channelId })
		let index = res.styles.findIndex(x => x.styleId === styleId)
		if (index > -1) {
			let current = res.styles[index]
			if (!current.plainColors.includes(plainColor)) {
				current.plainColors.push(plainColor)
			}
			if (!current.flowerColors.includes(flowerColor)) {
				current.flowerColors.push(flowerColor)
			}
		} else {
			res.styles.push({
				styleId,
				plainColors: [plainColor],
				flowerColors: [flowerColor]
			})
		}
		let data = await res.save()
		ctx.body = response(true, {})
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const unassign = async (ctx, next) => {
	try {
		const { channelId, styleId, plainColor, flowerColor } = ctx.request.body
		let res = await Channel.findById({ _id: channelId })
		let index = res.styles.findIndex(x => x.styleId === styleId)
		if (index > -1) {
			let current = res.styles[index]
			let ip = current.plainColors.findIndex(p => p === plainColor)
			const ic = current.flowerColors.findIndex(f => f === flowerColor)
			if (ip > -1) {
				current.plainColors.splice(ip, 1)
			}
			if (ic > -1) {
				current.flowerColors.splice(ic, 1)
			}
		}
		let data = res.save()
		ctx.body = response(true, {})
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const getAssign = async (ctx, next) => {
	try {
		const { channelId, styleId } = ctx.request.query
		let res = await Channel.findById({ _id: channelId }).populate()
		let data = res.styles.find(x => x.styleId === styleId)
		let plainColors = await Color.find({
			_id: {
				$in: data.plainColors
			}
		})

		let flowerColors = await Color.find({
			_id: {
				$in: data.flowerColors
			}
		})
		console.log(plainColors, flowerColors, "colors")
		data.plainColors = plainColors
		data.flowerColors = flowerColors
		ctx.body = response(true, data)
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const assignCategory = async (ctx, next) => {
	try {
		const { channelId, categoryId } = ctx.request.body
		let res = await Channel.findById({ _id: channelId })
		let index = res.categories.findIndex(x => x === categoryId)
		if (index > -1) {
			return
		} else {
			res.categories.push(categoryId)
		}
		let data = await res.save()
		ctx.body = response(true, {})
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const getAssignCategory = async (ctx, next) => {
	try {
		const { channelId } = ctx.request.query
		let res = await Channel.findById({ _id: channelId })

		ctx.body = response(true, {
			categories: res.categories
		})
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}

export const unassignCategory = async (ctx, next) => {
	try {
		const { channelId, categoryId } = ctx.request.body
		let res = await Channel.findById({ _id: channelId })
		let index = res.categories.findIndex(x => x === categoryId)
		if (index > -1) {
			res.categories.splice(index, 1)
		}
		let data = res.save()
		ctx.body = response(true, {})
	} catch (err) {
		console.log(err)
		ctx.body = response(false, null, err.message)
	}
}
