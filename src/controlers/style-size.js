import StyleSize from "../models/style-size";
import { response } from "../utils";

export const add = async (ctx, next) => {
  try {
    const body = ctx.request.body;
    let styleSize = new StyleSize(body);
    let data = await styleSize.save();
    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const getList = async (ctx, next) => {
  try {
    let data = await StyleSize.find();
    ctx.body = response(true, data, "成功");
  } catch (err) {
    ctx.body = response(false, null, err.message);
  }
};

export const update = async (ctx, next) => {
  try {
    const { _id, values, goods } = ctx.request.body;
    let data = await StyleSize.findByIdAndUpdate(
      { _id },
      { values, goods },
      { new: true }
    );
    ctx.body = response(true, data, "成功");
  } catch (err) {
    console.log(err);
    ctx.body = response(false, null, err.message);
  }
};
