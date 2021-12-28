import ShopStyle from "../models/shop-style";
import { response } from "../utils";
import { getCurrentUser } from "./user";
import Channel from "../models/channel";
export const add = async (ctx, next) => {
  try {
    const { ...others } = ctx.request.body;
    // const code = codePrefix[type] + moment().format("YYMMDDHHMMss")
    const count = await ShopStyle.find({branch: others.branch}).count();
    let shopStyle = new ShopStyle({
      ...others,
      sort: count
    });
    let data = await shopStyle.save();
    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const getList = async (ctx, next) => {
  try {
    let {
      code,
      name,
      branch,
      branchKind,
      page = 1,
      limit = 20,
    } = ctx.request.query;

    let q = {};
    if (typeof name !== "undefined") {
      q.namecn = {
        $regex: new RegExp(name, "i"),
      };
      q.nameen = {
        $regex: new RegExp(name, "i"),
      };
    }
    if (typeof code !== "undefined") {
      q.code = {
        $regex: new RegExp(code, "i"),
      };
    }
    if (typeof branch !== "undefined") {
      q.branch = branch;
    }
    if (typeof branchKind !== "undefined") {
      q.branchKind = branchKind;
    }
    const currentUser = await getCurrentUser(ctx);
    let myChannel = null;
    if (currentUser.role === 3 || currentUser.rolo === 4) {
      let channel = currentUser.channels.find((x) => x.assignedId === branch);
      let ids = [];
      if (channel) {
        if (channel.codename !== "A") {
          myChannel = await Channel.findOne({
            assignedId: channel.assignedId,
            codename: channel.codename,
          }).lean();
          ids = myChannel.shopStyles.map((cs) => cs.style);
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

    let data = await ShopStyle.paginate(q, {
      populate: {
        path: "colorWithStyleImgs.colorObj",
        model: "color",
      },
      page,
      // 如果没有limit字段，不分页
      // limit: limit ? limit : 10000,
      limit: parseInt(limit),
      sort: {
        sort: 1,
      },
      lean: true,
    });
    if (myChannel) {
      data.docs = data.docs.map((x) => {
        let f = myChannel.shopStyles.find((cs) => cs.style == x._id.toString());
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
    let data = await ShopStyle.findByIdAndUpdate(
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

export const sort = async (ctx, next) => {
    try {
      const { newSort = [] } = ctx.request.body;
      for (var i = 0; i < newSort.length; i++) {
        const { _id, sort } = newSort[i];
        await ShopStyle.findByIdAndUpdate(
          { _id },
          {
            sort,
          },
          {
            new: true,
          }
        );
      }
  
      ctx.body = response(true);
    } catch (err) {
      ctx.body = response(false, null, err.message);
    }
  };

export const del = async (ctx, next) => {
  try {
    const { _id } = ctx.request.body;
    let data = await ShopStyle.findByIdAndRemove({ _id });
    ctx.body = response(true, data, "成功");
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};
