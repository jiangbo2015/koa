import Router from "koa-router";

import * as capsuleItemController from "../controlers/capsule-item";

const router = new Router();
// 创建 CapsuleItem
router.post('/capsule-items', capsuleItemController.createCapsuleItem);

// 获取所有 CapsuleItem
router.get('/capsule-items', capsuleItemController.getAllCapsuleItems);

// 根据 ID 获取单个 CapsuleItem
router.get('/capsule-items/:id', capsuleItemController.getCapsuleItemById);

// 更新 CapsuleItem
router.patch('/capsule-items/:id', capsuleItemController.updateCapsuleItem);

// 软删除 CapsuleItem
router.delete('/capsule-items/:id', capsuleItemController.softDeleteCapsuleItem);

// 硬删除 CapsuleItem
router.delete('/capsule-items/hard/:id', capsuleItemController.hardDeleteCapsuleItem);

export default router.routes();
