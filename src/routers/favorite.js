import Router from "koa-router";

import * as favoriteController from "../controlers/favorite";

const router = new Router();
// 创建 Favorite
router.post('/favorites', favoriteController.createFavorite);

// 获取所有 Favorite
router.get('/favorites', favoriteController.getAllFavorites);

// 根据 ID 获取单个 Favorite
router.get('/favorites/:id', favoriteController.getFavoriteById);

// 更新 Favorite
router.patch('/favorites/:id', favoriteController.updateFavorite);

// 软删除 Favorite
router.delete('/favorites/:id', favoriteController.softDeleteFavorite);

// 硬删除 Favorite
router.delete('/favorites/hard/:id', favoriteController.hardDeleteFavorite);

export default router.routes();
