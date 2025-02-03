import Color from "../models/color";
import Channel from "../models/channel";
import { getCurrentUser } from "./user";

import { response } from "../utils";
import { logChange } from '../utils/changeLogger';

const codePrefix = {
  0: "S-",
  1: "H-",
};

export const add = async (ctx, next) => {
  try {
    const { type, code, value, ...others } = ctx.request.body;
    // const code = codePrefix[type] + moment().format("YYMMDDHHMMss")
    let color = new Color({
      type,
      value,
      code,
      ...others,
    });
    let data = await color.save();
    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const getList = async (ctx, next) => {
  try {
    let {
      type,
      code,
      page = 1,
      limit = 20,
      goodsId,
      sort = "time",
    } = ctx.request.query;

    let sortProps =
      sort === "time"
        ? {
            createdAt: -1,
          }
        : {
            colorSystem: -1,
          };
    let q = {isDel: { $ne : 1 } };
    if (typeof code !== "undefined") {
      q.code = {
        $regex: new RegExp(code, "i"),
      };
    }
    if (typeof type !== "undefined") {
      q.type = type;
    }

    if (goodsId) {
      q.goodsId = {
        $in: [goodsId],
      };
    }
    const currentUser = await getCurrentUser(ctx);
    let myChannel = null;
    if (currentUser.role === 3 || currentUser.role === 4) {
      let channel = currentUser.channels.find((x) => x.assignedId === goodsId);
      let ids = [];
      if (channel) {
        if (channel.codename !== "A") {
          myChannel = await Channel.findOne({
            assignedId: channel.assignedId,
            codename: channel.codename,
            owner: currentUser.owner,
          }).lean();
          ids =
            type == 1
              ? myChannel.flowerColors.map((x) => x.toString())
              : myChannel.plainColors.map((x) => x.toString());
          q._id = {
            $in: ids,
          };
        }
      } else {
        q._id = {
          $in: ids,
        };
      }
    }
    let data = await Color.paginate(q, {
      page,
      // 如果没有limit字段，不分页
      // limit: limit ? limit : 10000,
      limit: parseInt(limit),
      sort: sortProps,
    });
    ctx.body = response(
      true,
      {
        ...data,
        v: "1.6",
        q,
      },
      "成功v2"
    );
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

export const update = async (ctx, next) => {
  try {
    const { _id, ids, ...others } = ctx.request.body;
    let data = {};
    if (ids) {
        const originalDocs = await Color.find({ _id: { $in: ids } });

        // 2. 执行批量更新
        await Color.updateMany(
          { _id: { $in: ids } },
          { ...others }
        );
  
        // 3. 查询更新后的文档
        const updatedDocs = await Color.find({ _id: { $in: ids } });
  
        // 4. 对比更新前后的文档，记录变更日志
        for (let i = 0; i < originalDocs.length; i++) {
          const originalDoc = originalDocs[i];
          const updatedDoc = updatedDocs.find(doc => doc._id.equals(originalDoc._id));
  
          if (updatedDoc) {
            await logChange(
              originalDoc.toObject(),
              updatedDoc.toObject(),
              'color',
              originalDoc._id,
              currentUserId
            );
          }
        }
    } else {
        const originalDoc = await Color.findById(_id);
      data = await Color.findByIdAndUpdate(
        { _id },
        { ...others },
        { new: true }
      ); 
      logChange(originalDoc.toObject(), data.toObject(), 'color', _id, currentUserId)
    }

    ctx.body = response(true, data, "成功");
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

export const del = async (ctx, next) => {
  try {
    const { _id, ids } = ctx.request.body;
    let data = {};
    if (_id) {
        data = await Color.findByIdAndUpdate({ _id }, { isDel: 1 });
    }
    if (ids) {
        data = await Color.updateMany(
            {
              _id: {
                $in: ids,
              },
            },
            {
              isDel: 1,
            }
          );
    }

    ctx.body = response(true, data, "成功");
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};
