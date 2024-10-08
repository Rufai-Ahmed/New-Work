"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const complainController_1 = require("../controller/complainController");
const router = (0, express_1.Router)();
router.route("/create-user-complain/:userID").post(complainController_1.createUserComplain);
router.route("/mark-seen/:adminID/:complainID").patch(complainController_1.markAsSeenComplain);
router.route("/mark-resolve/:adminID/:complainID").patch(complainController_1.markResolveComplain);
router.route("/view-user-complain/:userID").get(complainController_1.viewUsersComplains);
exports.default = router;
