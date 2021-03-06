import Router from "koa-router";

import user from "./user";
import common from "./common";
import goods from "./goods";
import goodsbase from "./goodsbase";
import capsule from "./capsule";
import capsuleStyle from "./capsule-style";
import capsuleOrder from "./capsule-order";
import shopStyle from "./shop-style";
import shopOrder from "./shop-order";
import shopCart from "./shop-cart";
import color from "./color";
import style from "./style";
import system from "./system";
import order from "./order";
import branch from "./branch";
import branchKind from "./branch-kind";
import test from "./test";
import channel from "./channel";

const router = new Router({
  prefix: "/api",
});

router.use("/user", user);
router.use("/common", common);
router.use("/channel", channel);
router.use("/goods", goods);
router.use("/goodsbase", goodsbase);
router.use("/branch", branch);
router.use("/branchKind", branchKind);
router.use("/capsule", capsule);
router.use("/capsuleStyle", capsuleStyle);
router.use("/capsuleOrder", capsuleOrder);
router.use("/shopStyle", shopStyle);
router.use("/shopCart", shopCart);
router.use("/shopOrder", shopOrder);
router.use("/color", color);
router.use("/style", style);
router.use("/system", system);
router.use("/order", order);
router.use("/test", test);

export default router;
