import Router from "koa-router";

import user from "./user";
import common from "./common";
import goods from "./goods";
import goodsbase from "./goodsbase";
import capsule from "./capsule";
import capsuleItem from "./capsule-item";
import favorite from "./favorite";
import color from "./color";
import style from "./style";
import system from "./system";
import test from "./test";
import channel from "./channel";
import message from "./message";

const router = new Router({
  prefix: "/api",
});

router.use("/user", user);
router.use("/common", common);
router.use("/channel", channel);
router.use("/goods", goods);
router.use("/goodsbase", goodsbase);
router.use("/capsule", capsule);
router.use("/color", color);
router.use("/style", style);
router.use("/system", system);
router.use("/test", test);

router.use("/v2/capsule", capsuleItem);
router.use("/v2", favorite);
router.use("/v2", message);

export default router;
