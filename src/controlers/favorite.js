import Favorite from "../models/favorite";
import { response } from "../utils";

// 创建 Favorite
export const createFavorite = async (ctx) => {
  try {
    const favorite = new Favorite({ ...ctx.request.body });

    await favorite.save();
    ctx.status = 201;
    ctx.body = response(true, favorite, "成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = response(false, null, error.message);
  }
};

// 获取所有 Favorite
export const getAllFavorites = async (ctx) => {
  try {
    const favorites = await Favorite.find({ isDel: 0 });

    ctx.status = 200;
    ctx.body = response(true, favorites, "成功");
  } catch (error) {
    ctx.status = 500;
    ctx.body = response(false, null, error.message);
  }
};

// 根据 ID 获取单个 Favorite（包含 style 和 colors）
export const getFavoriteById = async (ctx) => {
  try {
    const favorite = await Favorite.findById(ctx.params.id);

    if (!favorite || favorite.isDel === 1) {
      ctx.status = 404;
      ctx.body = response(false, null, 'Favorite not found');
      return;
    }

    ctx.status = 200;
    response(true, favorite, "成功");
  } catch (error) {
    ctx.status = 500;
    ctx.body = response(false, null, error.message);
  }
};

// 更新 Favorite
export const updateFavorite = async (ctx) => {
  try {
    const _id = ctx.params.id
    const favorite = await Favorite.findByIdAndUpdate({ _id }, ctx.request.body);
    ctx.status = 200;
    ctx.body = response(true, favorite, "成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = response(false, null, error.message);
  }
};

// 软删除 Favorite
export const softDeleteFavorite = async (ctx) => {
  try {
    const favorite = await Favorite.findById(ctx.params.id);
    if (!favorite || favorite.isDel === 1) {
      ctx.status = 404;
      ctx.body = response(false, null, 'Favorite not found');
      return;
    }

    favorite.isDel = 1;
    await favorite.save();
    ctx.status = 200;
    ctx.body = response(true, {}, "Favorite deleted successfully");
  } catch (error) {
    ctx.status = 500;
    ctx.body = response(false, null, error.message);
  }
};

// 硬删除 Favorite
export const hardDeleteFavorite = async (ctx) => {
  try {
    const favorite = await Favorite.findByIdAndDelete(ctx.params.id);
    if (!favorite) {
      ctx.status = 404;
      ctx.body = response(false, null, 'Favorite not found');
      return;
    }
    ctx.status = 200;
    ctx.body = response(true, {}, "Favorite hard deleted successfully");
  } catch (error) {
    ctx.status = 500;
    ctx.body = response(false, null, error.message);
  }
};