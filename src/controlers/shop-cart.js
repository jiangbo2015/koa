import ShopCart from "../models/shop-cart";
import { response } from "../utils";
import { getCurrentUser } from "./user";
import moment from "moment";
import mongoose from "mongoose";

export const add = async (ctx, next) => {
  try {
    const body = ctx.request.body;

    const currentUser = await getCurrentUser(ctx);
    const q = {
      user: currentUser._id,
      shopStyle: body.shopStyle,
      isDel: 0,
    };
    const findList = await ShopCart.find(q);
    if (findList && findList.length > 0) {
      console.log(findList[0]);

      let data = await ShopCart.findOneAndUpdate(
        { _id: findList[0]._id },
        { count: findList[0].count + 1 },
        {
          new: true,
          upsert: true,
        }
      );

      ctx.body = response(true, data, "成功");
      return;
    }
    body.user = currentUser._id;
    let date = moment().format("YYYYMMDD");
    body.date = date;

    let shopCart = new ShopCart(body);
    let data = await shopCart.save();
    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const update = async (ctx, next) => {
  try {
    const { _id, ...others } = ctx.request.body;
    let data = await ShopCart.findOneAndUpdate({ _id }, others, {
      new: true,
      upsert: true,
    });

    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const detail = async (ctx, next) => {
  try {
    let data = await ShopCart.find();

    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const del = async (ctx, next) => {
  try {
    const { _id } = ctx.request.body;
    let data = await ShopCart.findByIdAndUpdate({ _id }, { isDel: 1 });
    ctx.body = response(true, data, "成功");
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};

export const getList = async (ctx, next) => {
  try {
    const { userId } = ctx.request.query;
    let q = {
      isDel: 0,
    };
    if (userId) {
      q.user = userId;
    }

    let data = await ShopCart.find(q)
      .sort({ createdAt: -1 })
      .populate({
        path: "shopStyle",
        populate: {
          path: "colorWithStyleImgs.colorObj",
          model: "color",
        },
      })
      .populate("user");

    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const getMyList = async (ctx, next) => {
  try {
    const currentUser = await getCurrentUser(ctx);
    const q = {
      user: mongoose.Types.ObjectId(currentUser._id),
      isDel: 0,
    };
    const data = await ShopCart.find(q)
      .sort({ createdAt: -1 })
      .populate("user")
      .populate({
        path: "shopStyle",
        populate: {
          path: "colorWithStyleImgs.colorObj",
          model: "color",
        },
      })
      .lean();

    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};
