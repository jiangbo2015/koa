import Capsule from "../models/capsule";
import CapsuleItem from "../models/capsule-itme";
import { get } from "lodash";
import Channel from "../models/channel";
import { logChange } from '../utils/changeLogger';
import { response } from "../utils";
import { addMessage } from '../utils/message';
import { getCurrentUser } from "./user";

const codePrefix = {
  0: "S-",
  1: "H-",
};

export const add = async (ctx) => {
  try {
    const { ...others } = ctx.request.body;
    // const code = codePrefix[type] + moment().format("YYMMDDHHMMss")
    let capsule = new Capsule({
      ...others,
    });
    let data = await capsule.save();
    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const getList = async (ctx) => {
  try {
    let { status, name, page = 1, limit = 20 } = ctx.request.query;

    let q = {};
    if (typeof name !== "undefined") {
      q.namecn = {
        $regex: new RegExp(name, "i"),
      };
      q.nameen = {
        $regex: new RegExp(name, "i"),
      };
    }
    if (typeof status !== "undefined") {
      q.status = status;
    }

    let data = await Capsule.paginate(q, {
      page,
      // 如果没有limit字段，不分页
      // limit: limit ? limit : 10000,
      limit: parseInt(limit),
      sort: {
        createdAt: -1,
      },
    });

    const promises = [];
    for (const doc of data.docs) {
        promises.push(
            CapsuleItem.findOne({ isDel: 0, capsule: doc._id })
            .then(item => ({
                ...doc.toObject(),
                imgUrl: item ? item.fileUrl : null // 如果 item 为 null，则设置 imgUrl 为 null
            }))
        );
    }
 
    data.docs = await Promise.all(promises);
    
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
    const { _id, ...others } = ctx.request.body;
    const currentUser = await getCurrentUser(ctx);
    const currentUserId = currentUser._id;
    const originalDoc = await Capsule.findById(_id);
    let data = await Capsule.findByIdAndUpdate(
      { _id },
      { ...others },
      { new: true }
    );
    logChange(originalDoc.toObject(), data.toObject(), 'capsule', _id, currentUserId)
    ctx.body = response(true, data, "成功");
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

export const del = async (ctx, next) => {
  try {
    const { _id } = ctx.request.body;
    let data = await Capsule.findByIdAndRemove({ _id });
    ctx.body = response(true, data, "成功");
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

export const getVisibleList = async (ctx, next) => {
  try {
    const { name } = ctx.request.query;
    let q = { status: 1};
    if (name) {
      q.name = name;
    }
    let data = await Capsule.find(q).sort({ createdAt: -1 }).lean();
    const user = await getCurrentUser(ctx, next);
    let result = [];
    if (user.role === 0) {
      result = data;
    } else {
      result = data.filter((d) => user.capsules.indexOf(d._id) >= 0);
    }

    ctx.body = response(true, result);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};
