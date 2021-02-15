import CapsuleStyle from "../models/capsule-style";
import { response } from "../utils";

export const add = async (ctx, next) => {
  try {
    const { ...others } = ctx.request.body;
    // const code = codePrefix[type] + moment().format("YYMMDDHHMMss")
    let capsuleStyle = new CapsuleStyle({
      ...others,
    });
    let data = await capsuleStyle.save();
    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const getList = async (ctx, next) => {
  try {
    let { capsule, name, page = 1, limit = 20 } = ctx.request.query;

    let q = {};
    if (typeof name !== "undefined") {
      q.namecn = {
        $regex: new RegExp(name, "i"),
      };
      q.nameen = {
        $regex: new RegExp(name, "i"),
      };
    }
    if (typeof capsule !== "undefined") {
      q.capsule = capsule;
    }

    let data = await CapsuleStyle.paginate(q, {
      page,
      // 如果没有limit字段，不分页
      // limit: limit ? limit : 10000,
      limit: parseInt(limit),
      populate: [
        {
          path: "colorWithStyleImgs.colorObj",
          model: "color",
        },
        {
          path: "colorWithStyleImgs.favorite",
          // model: "favorite",
          populate: [
            {
              path: "styleAndColor.styleId",
              // model: "style",
            },
            {
              path: "styleAndColor.colorIds",
            },
          ],
        },
      ],
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
    let data = await CapsuleStyle.findByIdAndUpdate(
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
    let data = await CapsuleStyle.findByIdAndRemove({ _id });
    ctx.body = response(true, data, "成功");
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};
