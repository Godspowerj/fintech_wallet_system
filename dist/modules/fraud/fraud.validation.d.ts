import { z } from 'zod';
export declare const flagIdParamSchema: z.ZodObject<{
    params: z.ZodObject<{
        flagId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        flagId: string;
    }, {
        flagId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        flagId: string;
    };
}, {
    params: {
        flagId: string;
    };
}>;
export declare const reviewDecisionSchema: z.ZodObject<{
    body: z.ZodObject<{
        decision: z.ZodEnum<["approve", "reject"]>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        decision: "approve" | "reject";
        notes?: string | undefined;
    }, {
        decision: "approve" | "reject";
        notes?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        decision: "approve" | "reject";
        notes?: string | undefined;
    };
}, {
    body: {
        decision: "approve" | "reject";
        notes?: string | undefined;
    };
}>;
export declare const getFlagsQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>;
        limit: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>;
        status: z.ZodOptional<z.ZodEnum<["FLAGGED", "REVIEWING", "APPROVED", "REJECTED"]>>;
        minRiskScore: z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined, string | undefined>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        status?: "FLAGGED" | "REVIEWING" | "APPROVED" | "REJECTED" | undefined;
        minRiskScore?: number | undefined;
    }, {
        status?: "FLAGGED" | "REVIEWING" | "APPROVED" | "REJECTED" | undefined;
        limit?: string | undefined;
        page?: string | undefined;
        minRiskScore?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        status?: "FLAGGED" | "REVIEWING" | "APPROVED" | "REJECTED" | undefined;
        minRiskScore?: number | undefined;
    };
}, {
    query: {
        status?: "FLAGGED" | "REVIEWING" | "APPROVED" | "REJECTED" | undefined;
        limit?: string | undefined;
        page?: string | undefined;
        minRiskScore?: string | undefined;
    };
}>;
export type FlagIdParam = z.infer<typeof flagIdParamSchema>['params'];
export type ReviewDecisionInput = z.infer<typeof reviewDecisionSchema>['body'];
export type GetFlagsQuery = z.infer<typeof getFlagsQuerySchema>['query'];
//# sourceMappingURL=fraud.validation.d.ts.map