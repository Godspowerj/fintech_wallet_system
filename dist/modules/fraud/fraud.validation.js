"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlagsQuerySchema = exports.reviewDecisionSchema = exports.flagIdParamSchema = void 0;
const zod_1 = require("zod");
exports.flagIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        flagId: zod_1.z.string().uuid('Invalid flag ID format'),
    }),
});
exports.reviewDecisionSchema = zod_1.z.object({
    body: zod_1.z.object({
        decision: zod_1.z.enum(['approve', 'reject'], {
            required_error: 'Decision is required',
            invalid_type_error: 'Decision must be either "approve" or "reject"',
        }),
        notes: zod_1.z.string()
            .max(500, 'Notes must be 500 characters or less')
            .optional(),
    }),
});
exports.getFlagsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 1)),
        limit: zod_1.z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 20)),
        status: zod_1.z.enum(['FLAGGED', 'REVIEWING', 'APPROVED', 'REJECTED']).optional(),
        minRiskScore: zod_1.z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : undefined)),
    }),
});
//# sourceMappingURL=fraud.validation.js.map