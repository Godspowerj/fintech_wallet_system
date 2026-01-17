"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', (0, validation_middleware_1.validate)(auth_validation_1.registerSchema), authController.register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', (0, validation_middleware_1.validate)(auth_validation_1.loginSchema), authController.login);
/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 */
router.post('/refresh', (0, validation_middleware_1.validate)(auth_validation_1.refreshTokenSchema), authController.refreshToken);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 */
router.post('/logout', (0, validation_middleware_1.validate)(auth_validation_1.refreshTokenSchema), authController.logout);
/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify email address
 *     tags: [Auth]
 */
router.post('/verify-email', (0, validation_middleware_1.validate)(auth_validation_1.verifyEmailSchema), authController.verifyEmail);
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 */
router.post('/forgot-password', (0, validation_middleware_1.validate)(auth_validation_1.forgotPasswordSchema), authController.forgotPassword);
/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 */
router.post('/reset-password', (0, validation_middleware_1.validate)(auth_validation_1.resetPasswordSchema), authController.resetPassword);
/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.get('/profile', auth_middleware_1.authenticate, authController.getProfile);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map