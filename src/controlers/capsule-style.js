import { response } from "../utils";
import Channel from "../models/channel";
import CapsuleStyle from "../models/capsule-style";
import { getCurrentUser } from "./user";

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
    let { capsule, code, name, page = 1, limit = 20 } = ctx.request.query;

    let q = {};
    if (typeof code !== "undefined") {
      q.code = {
        $regex: new RegExp(code, "i"),
      };
    }
    if (typeof capsule !== "undefined") {
      q.capsule = capsule;
    }
    const currentUser = await getCurrentUser(ctx);
    let myChannel = null;
    if (currentUser.role === 3 || currentUser.rolo === 4) {
      let channel = currentUser.channels.find((x) => x.assignedId === capsule);
      let ids = [];
      if (channel) {
        if (channel.codename !== "A") {
          myChannel = await Channel.findOne({
            assignedId: channel.assignedId,
            codename: channel.codename,
          }).lean();
          ids = myChannel.capsuleStyles.map((cs) => cs.style);
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
      lean: true,
    });
    if (myChannel) {
      data.docs = data.docs.map((x) => {
        let f = myChannel.capsuleStyles.find(
          (cs) => cs.style == x._id.toString()
        );
        f = f ? f : {};
        return {
          ...x,
          price: f.price,
        };
      });
    }

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
