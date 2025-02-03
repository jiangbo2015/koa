import CapsuleItem from "../models/capsule-itme";
import { response } from "../utils";

// 创建 CapsuleItem
export const createCapsuleItem = async (ctx) => {
  try {
    const { type, fileUrl, capsule, style, colors } = ctx.request.body;

    let capsuleItem;
    if (type === 'style') {
      capsuleItem = new CapsuleItem({ type, capsule, style, colors });
    } else {
      capsuleItem = new CapsuleItem({ type, fileUrl, capsule });
    }

    await capsuleItem.save();
    ctx.status = 201;
    ctx.body = response(true, capsuleItem, "成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = response(false, null, error.message);
  }
};

// 获取所有 CapsuleItem（包含 style 和 colors）
export const getAllCapsuleItems = async (ctx) => {
  try {
    const capsuleItems = await CapsuleItem.find({ isDel: 0 })
      .populate('style') // 填充 style 字段
      .populate('colors'); // 填充 colors 字段

    ctx.status = 200;
    ctx.body = response(true, capsuleItems, "成功");
  } catch (error) {
    ctx.status = 500;
    ctx.body = response(false, null, error.message);
  }
};

// 根据 ID 获取单个 CapsuleItem（包含 style 和 colors）
export const getCapsuleItemById = async (ctx) => {
  try {
    const capsuleItem = await CapsuleItem.findById(ctx.params.id)
      .populate('style') // 填充 style 字段
      .populate('colors'); // 填充 colors 字段

    if (!capsuleItem || capsuleItem.isDel === 1) {
      ctx.status = 404;
      ctx.body = response(false, null, 'CapsuleItem not found');
      return;
    }

    ctx.status = 200;
    response(true, capsuleItem, "成功");
  } catch (error) {
    ctx.status = 500;
    ctx.body = response(false, null, error.message);
  }
};

// 更新 CapsuleItem
export const updateCapsuleItem = async (ctx) => {
  try {
    const _id = ctx.params.id  
    const capsuleItem = await CapsuleItem.findByIdAndUpdate({ _id }, ctx.request.body);
    ctx.status = 200;
    ctx.body = response(true, capsuleItem, "成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = response(false, null, error.message);
  }
};

// 软删除 CapsuleItem
export const softDeleteCapsuleItem = async (ctx) => {
  try {
    const capsuleItem = await CapsuleItem.findById(ctx.params.id);
    if (!capsuleItem || capsuleItem.isDel === 1) {
      ctx.status = 404;
      ctx.body = response(false, null, 'CapsuleItem not found');
      return;
    }

    capsuleItem.isDel = 1;
    await capsuleItem.save();
    ctx.status = 200;
    ctx.body = response(true, {}, "CapsuleItem deleted successfully");
  } catch (error) {
    ctx.status = 500;
    ctx.body = response(false, null, error.message);
  }
};

// 硬删除 CapsuleItem
export const hardDeleteCapsuleItem = async (ctx) => {
  try {
    const capsuleItem = await CapsuleItem.findByIdAndDelete(ctx.params.id);
    if (!capsuleItem) {
      ctx.status = 404;
      ctx.body = response(false, null, 'CapsuleItem not found');
      return;
    }
    ctx.status = 200;
    ctx.body = response(true, {}, "CapsuleItem hard deleted successfully");
  } catch (error) {
    ctx.status = 500;
    ctx.body = response(false, null, error.message);
  }
};