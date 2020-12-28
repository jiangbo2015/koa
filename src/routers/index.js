import Router from "koa-router";

import user from "./user";
import common from "./common";
import goods from "./goods";
import goodsbase from "./goodsbase";
import capsule from "./capsule";
import capsuleStyle from "./capsule-style";
import color from "./color";
import style from "./style";
import system from "./system";
import order from "./order";
import test from "./test";

const router = new Router({
  prefix: "/api",
});

router.use("/user", user);
router.use("/common", common);
router.use("/goods", goods);
router.use("/goodsbase", goodsbase);
router.use("/capsule", capsule);
router.use("/capsuleStyle", capsuleStyle);
router.use("/color", color);
router.use("/style", style);
router.use("/system", system);
router.use("/order", order);
router.use("/test", test);

export default router;
