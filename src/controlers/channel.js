import { get, includes } from "lodash";

import Channel from "../models/channel";
import { addMessage } from '../utils/message';
import { logChange } from '../utils/changeLogger';
import { response } from "../utils";
import { getCurrentUser } from "./user";
/** 导出excel **/
// var json2xls = require("json2xls")
// import fs from "fs"
// var xls = json2xls(data)
// fs.writeFileSync("data.xlsx", xls, "binary")

export const add = async (ctx, next) => {
  try {
    const currentUser = await getCurrentUser(ctx);
    const owner = currentUser._id;
    const body = { ...ctx.request.body, owner };
    let channel = new Channel(body);
    const data = await channel.save();
    ctx.body = response(true, data);
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

export const getMyAdminList = async (ctx, next) => {
  try {
    const currentUser = await getCurrentUser(ctx);
    const { assignedId } = ctx.request.query;
    let q = {};
    if (assignedId) {
      q.assignedId = assignedId;
    }
    // if (owner) {
    q.owner = currentUser._id;
    // }

    let data = await Channel.find(q).sort({ codename: 1 });

    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const del = async (ctx, next) => {
  try {
    const { _id } = ctx.request.body;
    let data = await Channel.deleteOne({ _id });
    ctx.body = response(true, data);
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

export const update = async (ctx, next) => {
  try {
    const { _id, ...others } = ctx.request.body;
    const currentUser = await getCurrentUser(ctx);
    const currentUserId = currentUser._id;
    if (_id) {
      const originalDoc = await Channel.findById(_id);
      const data = await Channel.findByIdAndUpdate({ _id }, others);
      logChange(originalDoc.toObject(), data.toObject(), 'channel', _id, currentUserId)
      ctx.body = response(true, data);
    }
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

export const updateCapsules = async (ctx, next) => {
    try {
      const { _id, capsules } = ctx.request.body;
      const currentUser = await getCurrentUser(ctx);
      const currentUserId = currentUser._id;
   
      if (_id) {
        // 查询当前的 channel 文档
        const originalDoc = await Channel.findById(_id);
        const originalCapsules = get(originalDoc, 'capsules', [])
        const newCapsules = capsules.filter(cid => !includes(originalCapsules, cid))
        const data = await Channel.findByIdAndUpdate({ _id }, { capsules });

        // 如果有新增的 capsule ID，发送消息
        if (newCapsules.length > 0) {
            for (const newCapsuleId of newCapsules) {
                // 向 channel 的所有用户发送消息
                for (const userId of data.users) {
                    await addMessage({
                        userId,
                        content: `胶囊上新： ${doc.name}，请点击 <a href="/capsules/${newCapsuleId}">查看详情</a>。`,
                        type: 'new-capsule-notice',
                        objectModelId: newCapsuleId,
                        objectModel: 'capsule',
                    });
                }
            }
        }

        logChange(originalDoc.toObject(), data.toObject(), 'channel', _id, currentUserId)
        // console.log("newCapsules", newCapsules)
        ctx.body = response(true, data);
      }
    } catch (err) {
      console.log(err);
      ctx.body = response(false, null, err.message);
    }
};

export const findAll = async (ctx, next) => {
  try {
    let data = await Channel.find();
    ctx.body = response(true, data);
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

export const findById = async (ctx, next) => {
  try {
    const { _id } = ctx.request.query;
    let data = await Channel.findById({ _id });
    ctx.body = response(true, data);
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

