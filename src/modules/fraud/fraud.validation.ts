import { z } from 'zod';

export const flagIdParamSchema = z.object({
    params: z.object({
        flagId: z.string().uuid('Invalid flag ID format'),
    }),
});

export const reviewDecisionSchema = z.object({
    body: z.object({
        decision: z.enum(['approve', 'reject'], {
            required_error: 'Decision is required',
            invalid_type_error: 'Decision must be either "approve" or "reject"',
        }),
        notes: z.string()
            .max(500, 'Notes must be 500 characters or less')
            .optional(),
    }),
});

export const getFlagsQuerySchema = z.object({
    query: z.object({
        page: z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 1)),
        limit: z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 20)),
        status: z.enum(['FLAGGED', 'REVIEWING', 'APPROVED', 'REJECTED']).optional(),
        minRiskScore: z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : undefined)),
    }),
});

export type FlagIdParam = z.infer<typeof flagIdParamSchema>['params'];
export type ReviewDecisionInput = z.infer<typeof reviewDecisionSchema>['body'];
export type GetFlagsQuery = z.infer<typeof getFlagsQuerySchema>['query'];
