import Capsule from "../models/capsule";
import lodash from "lodash";
import Channel from "../models/channel";

import { response } from "../utils";
import { getCurrentUser } from "./user";
import { getList as csGetList } from "./capsule-style";

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
    let data = await Capsule.findByIdAndUpdate(
      { _id },
      { ...others },
      { new: true }
    );
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
    let q = {};
    if (name) {
      q.name = name;
    }
    let data = await Capsule.find(q).lean();
    const user = await getCurrentUser(ctx, next);
    let result = [];
    if (user.role === 0) {
      result = data;
    } else {
      result = data.filter((d) => user.capsules.indexOf(d._id) >= 0);
    }

    for (let i = 0; i < result.length; i++) {
      let capsuleStyles = await csGetList({
        ...ctx,
        request: { ...ctx.request, query: { capsule: result[i]._id } },
      });
      let group = lodash.groupBy(
        capsuleStyles.filter((x) => !!x.goodCategory),
        (cs) => cs.goodCategory.name
      );
      let children = Object.values(group).map((x) => ({
        namecn: x[0].goodCategory.name,
        nameen: x[0].goodCategory.enname,
      }));
      console.log("capsuleStyles", capsuleStyles);
      console.log("children", children);
      result[i].children = children;
    }

    ctx.body = response(true, result);
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};
