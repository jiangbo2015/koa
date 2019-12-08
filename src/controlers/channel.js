import Channel from "../models/channel"
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
	try {
		let data = await Channel.find().lean()

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
		let data = await Channel.updateOne({ _id }, ...others)
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
