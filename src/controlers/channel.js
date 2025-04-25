import { get, includes } from "lodash";
import mongoose from "mongoose";

import User from "../models/user";
import Channel from "../models/channel";
import Capsule from "../models/capsule";

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
      console.log('_id', _id)
      console.log('capsules', capsules)
   
      if (_id) {
        // 查询当前的 channel 文档
        const originalDoc = await Channel.findById(_id);
        const originalCapsules = get(originalDoc, 'capsules', [])
        const newCapsules = capsules.filter(cid => !includes(originalCapsules, cid))
        const data = await Channel.findByIdAndUpdate({ _id }, { capsules });
        const costomers = await User.find({
            channel: _id
        })
        
        // 如果有新增的 capsule ID，发送消息
        if (newCapsules.length > 0) {
            for (const newCapsuleId of newCapsules) {
                
                const newCapsuleData = await Capsule.findById(newCapsuleId)
                const coverImage = get(newCapsuleData, 'capsuleItems.0.fileUrl') || 
                get(newCapsuleData, 'capsuleItems.0.finishedStyleColorsList.0.imgUrlFront')
                console.log('newCapsuleData', newCapsuleData)
                console.log('coverImage', coverImage)
                // 向 channel 的所有用户发送消息
                for (const costomer of costomers) {
                    console.log('userId', costomer._id)
                    await addMessage({
                        userId: costomer._id,
                        content: `胶囊上新！`,
                        type: 'new-capsule-notice',
                        objectModelId: newCapsuleId,
                        objectModel: 'capsule',
                        coverImage
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

export const updateCostomers = async (ctx, next) => {
    try {
      const { _id, costomers } = ctx.request.body;
      const currentUser = await getCurrentUser(ctx);
      const currentUserId = currentUser._id;
   
      if (_id) {
        // const session = await mongoose.startSession();
       
        try {       
          // 第一个更新操作
          const result1 = await User.updateMany(
            { channel: _id },
            { channel: null },
            // { session } // 在这个会话中执行操作
          ).exec(); // 使用exec()来确保我们传递了session
       
          // 第二个更新操作
          const result2 = await User.updateMany(
            { _id: { $in: costomers } },
            { channel: _id },
            // { session } // 在这个会话中执行操作
          ).exec(); // 使用exec()来确保我们传递了session
       
          // 提交事务
        //   await session.commitTransaction();
          console.log('Transaction has been committed');
          console.log('result1 ', result1);
          console.log('result2 ', result2);
          
        } catch (error) {
          // 如果发生错误，则中止事务
        //   await session.abortTransaction();
          console.error('Transaction has been aborted due to an error:', error);
        } finally {
          // 结束会话
        //   session.endSession();
        }
        // logChange(originalDoc.toObject(), data.toObject(), 'channel', _id, currentUserId)
        // console.log("newCapsules", newCapsules)
        ctx.body = response(true, null);
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
  
      const result = await Channel.aggregate([
        // 匹配指定的 Channel _id
        { $match: { _id: mongoose.Types.ObjectId(_id) } },
        // 关联 User 集合，查找 channel 字段等于当前 Channel _id 的用户
        {
          $lookup: {
            from: 'users', // User 集合的名称
            localField: '_id', // Channel 的 _id 字段
            foreignField: 'channel', // User 的 channel 字段
            as: 'costomers', // 将查询结果存储到 costomers 字段中
          },
        },
        // 可选：对关联的字段进行 populate 操作
        {
          $lookup: {
            from: 'colors', // plainColors 集合的名称
            localField: 'plainColors', // Channel 的 plainColors 字段
            foreignField: '_id', // plainColors 的 _id 字段
            as: 'populatedPlainColors', // 将查询结果存储回 plainColors 字段
          },
        },
        {
          $lookup: {
            from: 'colors', // flowerColors 集合的名称
            localField: 'flowerColors', // Channel 的 flowerColors 字段
            foreignField: '_id', // flowerColors 的 _id 字段
            as: 'populatedFlowerColors', // 将查询结果存储回 flowerColors 字段
          },
        },
        {
            $lookup: {
              from: 'colors', // flowerColors 集合的名称
              localField: 'textures', // Channel 的 flowerColors 字段
              foreignField: '_id', // flowerColors 的 _id 字段
              as: 'populatedTextures', // 将查询结果存储回 flowerColors 字段
            },
        },
        {
          $lookup: {
            from: 'capsules', // capsules 集合的名称
            localField: 'capsules', // Channel 的 capsules 字段
            foreignField: '_id', // capsules 的 _id 字段
            as: 'populatedCapsules', // 将查询结果存储回 capsules 字段
          },
        },
        {
            $lookup: {
                from: 'styles', 
                localField: 'styles',
                foreignField: '_id',
                as: 'populatedStyles',
            },
        }
        // // 限制返回的字段（可选）
        // {
        //   $project: {
        //     // 包含需要的字段
        //     plainColors: 1,
        //     flowerColors: 1,
        //     capsules: 1,
        //     costomers: 1,
        //   },
        // },
      ]);
  
    //   console.log(result); 
      // 如果查询结果为空，返回错误
      if (result.length === 0) {
        ctx.body = response(false, null, 'Channel not found');
        return;
      }
  
      // 返回查询结果
      const data = result[0];
      ctx.body = response(true, data);
    } catch (err) {
      console.log(err);
      ctx.body = response(false, null, err.message);
    }
  };

