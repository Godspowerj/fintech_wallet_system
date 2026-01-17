import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model FraudFlag
 *
 */
export type FraudFlagModel = runtime.Types.Result.DefaultSelection<Prisma.$FraudFlagPayload>;
export type AggregateFraudFlag = {
    _count: FraudFlagCountAggregateOutputType | null;
    _avg: FraudFlagAvgAggregateOutputType | null;
    _sum: FraudFlagSumAggregateOutputType | null;
    _min: FraudFlagMinAggregateOutputType | null;
    _max: FraudFlagMaxAggregateOutputType | null;
};
export type FraudFlagAvgAggregateOutputType = {
    riskScore: number | null;
};
export type FraudFlagSumAggregateOutputType = {
    riskScore: number | null;
};
export type FraudFlagMinAggregateOutputType = {
    id: string | null;
    transactionId: string | null;
    reason: string | null;
    riskScore: number | null;
    status: $Enums.FraudStatus | null;
    reviewedBy: string | null;
    reviewedAt: Date | null;
    reviewNotes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type FraudFlagMaxAggregateOutputType = {
    id: string | null;
    transactionId: string | null;
    reason: string | null;
    riskScore: number | null;
    status: $Enums.FraudStatus | null;
    reviewedBy: string | null;
    reviewedAt: Date | null;
    reviewNotes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type FraudFlagCountAggregateOutputType = {
    id: number;
    transactionId: number;
    reason: number;
    riskScore: number;
    status: number;
    reviewedBy: number;
    reviewedAt: number;
    reviewNotes: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type FraudFlagAvgAggregateInputType = {
    riskScore?: true;
};
export type FraudFlagSumAggregateInputType = {
    riskScore?: true;
};
export type FraudFlagMinAggregateInputType = {
    id?: true;
    transactionId?: true;
    reason?: true;
    riskScore?: true;
    status?: true;
    reviewedBy?: true;
    reviewedAt?: true;
    reviewNotes?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type FraudFlagMaxAggregateInputType = {
    id?: true;
    transactionId?: true;
    reason?: true;
    riskScore?: true;
    status?: true;
    reviewedBy?: true;
    reviewedAt?: true;
    reviewNotes?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type FraudFlagCountAggregateInputType = {
    id?: true;
    transactionId?: true;
    reason?: true;
    riskScore?: true;
    status?: true;
    reviewedBy?: true;
    reviewedAt?: true;
    reviewNotes?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type FraudFlagAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which FraudFlag to aggregate.
     */
    where?: Prisma.FraudFlagWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FraudFlags to fetch.
     */
    orderBy?: Prisma.FraudFlagOrderByWithRelationInput | Prisma.FraudFlagOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.FraudFlagWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FraudFlags from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FraudFlags.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned FraudFlags
    **/
    _count?: true | FraudFlagCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: FraudFlagAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: FraudFlagSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: FraudFlagMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: FraudFlagMaxAggregateInputType;
};
export type GetFraudFlagAggregateType<T extends FraudFlagAggregateArgs> = {
    [P in keyof T & keyof AggregateFraudFlag]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFraudFlag[P]> : Prisma.GetScalarType<T[P], AggregateFraudFlag[P]>;
};
export type FraudFlagGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FraudFlagWhereInput;
    orderBy?: Prisma.FraudFlagOrderByWithAggregationInput | Prisma.FraudFlagOrderByWithAggregationInput[];
    by: Prisma.FraudFlagScalarFieldEnum[] | Prisma.FraudFlagScalarFieldEnum;
    having?: Prisma.FraudFlagScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FraudFlagCountAggregateInputType | true;
    _avg?: FraudFlagAvgAggregateInputType;
    _sum?: FraudFlagSumAggregateInputType;
    _min?: FraudFlagMinAggregateInputType;
    _max?: FraudFlagMaxAggregateInputType;
};
export type FraudFlagGroupByOutputType = {
    id: string;
    transactionId: string;
    reason: string;
    riskScore: number;
    status: $Enums.FraudStatus;
    reviewedBy: string | null;
    reviewedAt: Date | null;
    reviewNotes: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: FraudFlagCountAggregateOutputType | null;
    _avg: FraudFlagAvgAggregateOutputType | null;
    _sum: FraudFlagSumAggregateOutputType | null;
    _min: FraudFlagMinAggregateOutputType | null;
    _max: FraudFlagMaxAggregateOutputType | null;
};
type GetFraudFlagGroupByPayload<T extends FraudFlagGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<FraudFlagGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof FraudFlagGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], FraudFlagGroupByOutputType[P]> : Prisma.GetScalarType<T[P], FraudFlagGroupByOutputType[P]>;
}>>;
export type FraudFlagWhereInput = {
    AND?: Prisma.FraudFlagWhereInput | Prisma.FraudFlagWhereInput[];
    OR?: Prisma.FraudFlagWhereInput[];
    NOT?: Prisma.FraudFlagWhereInput | Prisma.FraudFlagWhereInput[];
    id?: Prisma.StringFilter<"FraudFlag"> | string;
    transactionId?: Prisma.StringFilter<"FraudFlag"> | string;
    reason?: Prisma.StringFilter<"FraudFlag"> | string;
    riskScore?: Prisma.IntFilter<"FraudFlag"> | number;
    status?: Prisma.EnumFraudStatusFilter<"FraudFlag"> | $Enums.FraudStatus;
    reviewedBy?: Prisma.StringNullableFilter<"FraudFlag"> | string | null;
    reviewedAt?: Prisma.DateTimeNullableFilter<"FraudFlag"> | Date | string | null;
    reviewNotes?: Prisma.StringNullableFilter<"FraudFlag"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"FraudFlag"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"FraudFlag"> | Date | string;
    transaction?: Prisma.XOR<Prisma.TransactionScalarRelationFilter, Prisma.TransactionWhereInput>;
};
export type FraudFlagOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    transactionId?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    riskScore?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    reviewedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    reviewedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    reviewNotes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    transaction?: Prisma.TransactionOrderByWithRelationInput;
};
export type FraudFlagWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.FraudFlagWhereInput | Prisma.FraudFlagWhereInput[];
    OR?: Prisma.FraudFlagWhereInput[];
    NOT?: Prisma.FraudFlagWhereInput | Prisma.FraudFlagWhereInput[];
    transactionId?: Prisma.StringFilter<"FraudFlag"> | string;
    reason?: Prisma.StringFilter<"FraudFlag"> | string;
    riskScore?: Prisma.IntFilter<"FraudFlag"> | number;
    status?: Prisma.EnumFraudStatusFilter<"FraudFlag"> | $Enums.FraudStatus;
    reviewedBy?: Prisma.StringNullableFilter<"FraudFlag"> | string | null;
    reviewedAt?: Prisma.DateTimeNullableFilter<"FraudFlag"> | Date | string | null;
    reviewNotes?: Prisma.StringNullableFilter<"FraudFlag"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"FraudFlag"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"FraudFlag"> | Date | string;
    transaction?: Prisma.XOR<Prisma.TransactionScalarRelationFilter, Prisma.TransactionWhereInput>;
}, "id">;
export type FraudFlagOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    transactionId?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    riskScore?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    reviewedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    reviewedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    reviewNotes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.FraudFlagCountOrderByAggregateInput;
    _avg?: Prisma.FraudFlagAvgOrderByAggregateInput;
    _max?: Prisma.FraudFlagMaxOrderByAggregateInput;
    _min?: Prisma.FraudFlagMinOrderByAggregateInput;
    _sum?: Prisma.FraudFlagSumOrderByAggregateInput;
};
export type FraudFlagScalarWhereWithAggregatesInput = {
    AND?: Prisma.FraudFlagScalarWhereWithAggregatesInput | Prisma.FraudFlagScalarWhereWithAggregatesInput[];
    OR?: Prisma.FraudFlagScalarWhereWithAggregatesInput[];
    NOT?: Prisma.FraudFlagScalarWhereWithAggregatesInput | Prisma.FraudFlagScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"FraudFlag"> | string;
    transactionId?: Prisma.StringWithAggregatesFilter<"FraudFlag"> | string;
    reason?: Prisma.StringWithAggregatesFilter<"FraudFlag"> | string;
    riskScore?: Prisma.IntWithAggregatesFilter<"FraudFlag"> | number;
    status?: Prisma.EnumFraudStatusWithAggregatesFilter<"FraudFlag"> | $Enums.FraudStatus;
    reviewedBy?: Prisma.StringNullableWithAggregatesFilter<"FraudFlag"> | string | null;
    reviewedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"FraudFlag"> | Date | string | null;
    reviewNotes?: Prisma.StringNullableWithAggregatesFilter<"FraudFlag"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"FraudFlag"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"FraudFlag"> | Date | string;
};
export type FraudFlagCreateInput = {
    id?: string;
    reason: string;
    riskScore?: number;
    status?: $Enums.FraudStatus;
    reviewedBy?: string | null;
    reviewedAt?: Date | string | null;
    reviewNotes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transaction: Prisma.TransactionCreateNestedOneWithoutFraudFlagsInput;
};
export type FraudFlagUncheckedCreateInput = {
    id?: string;
    transactionId: string;
    reason: string;
    riskScore?: number;
    status?: $Enums.FraudStatus;
    reviewedBy?: string | null;
    reviewedAt?: Date | string | null;
    reviewNotes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FraudFlagUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    riskScore?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumFraudStatusFieldUpdateOperationsInput | $Enums.FraudStatus;
    reviewedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reviewNotes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transaction?: Prisma.TransactionUpdateOneRequiredWithoutFraudFlagsNestedInput;
};
export type FraudFlagUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    transactionId?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    riskScore?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumFraudStatusFieldUpdateOperationsInput | $Enums.FraudStatus;
    reviewedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reviewNotes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FraudFlagCreateManyInput = {
    id?: string;
    transactionId: string;
    reason: string;
    riskScore?: number;
    status?: $Enums.FraudStatus;
    reviewedBy?: string | null;
    reviewedAt?: Date | string | null;
    reviewNotes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FraudFlagUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    riskScore?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumFraudStatusFieldUpdateOperationsInput | $Enums.FraudStatus;
    reviewedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reviewNotes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FraudFlagUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    transactionId?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    riskScore?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumFraudStatusFieldUpdateOperationsInput | $Enums.FraudStatus;
    reviewedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reviewNotes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FraudFlagListRelationFilter = {
    every?: Prisma.FraudFlagWhereInput;
    some?: Prisma.FraudFlagWhereInput;
    none?: Prisma.FraudFlagWhereInput;
};
export type FraudFlagOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type FraudFlagCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    transactionId?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    riskScore?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    reviewedBy?: Prisma.SortOrder;
    reviewedAt?: Prisma.SortOrder;
    reviewNotes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type FraudFlagAvgOrderByAggregateInput = {
    riskScore?: Prisma.SortOrder;
};
export type FraudFlagMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    transactionId?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    riskScore?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    reviewedBy?: Prisma.SortOrder;
    reviewedAt?: Prisma.SortOrder;
    reviewNotes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type FraudFlagMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    transactionId?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    riskScore?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    reviewedBy?: Prisma.SortOrder;
    reviewedAt?: Prisma.SortOrder;
    reviewNotes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type FraudFlagSumOrderByAggregateInput = {
    riskScore?: Prisma.SortOrder;
};
export type FraudFlagCreateNestedManyWithoutTransactionInput = {
    create?: Prisma.XOR<Prisma.FraudFlagCreateWithoutTransactionInput, Prisma.FraudFlagUncheckedCreateWithoutTransactionInput> | Prisma.FraudFlagCreateWithoutTransactionInput[] | Prisma.FraudFlagUncheckedCreateWithoutTransactionInput[];
    connectOrCreate?: Prisma.FraudFlagCreateOrConnectWithoutTransactionInput | Prisma.FraudFlagCreateOrConnectWithoutTransactionInput[];
    createMany?: Prisma.FraudFlagCreateManyTransactionInputEnvelope;
    connect?: Prisma.FraudFlagWhereUniqueInput | Prisma.FraudFlagWhereUniqueInput[];
};
export type FraudFlagUncheckedCreateNestedManyWithoutTransactionInput = {
    create?: Prisma.XOR<Prisma.FraudFlagCreateWithoutTransactionInput, Prisma.FraudFlagUncheckedCreateWithoutTransactionInput> | Prisma.FraudFlagCreateWithoutTransactionInput[] | Prisma.FraudFlagUncheckedCreateWithoutTransactionInput[];
    connectOrCreate?: Prisma.FraudFlagCreateOrConnectWithoutTransactionInput | Prisma.FraudFlagCreateOrConnectWithoutTransactionInput[];
    createMany?: Prisma.FraudFlagCreateManyTransactionInputEnvelope;
    connect?: Prisma.FraudFlagWhereUniqueInput | Prisma.FraudFlagWhereUniqueInput[];
};
export type FraudFlagUpdateManyWithoutTransactionNestedInput = {
    create?: Prisma.XOR<Prisma.FraudFlagCreateWithoutTransactionInput, Prisma.FraudFlagUncheckedCreateWithoutTransactionInput> | Prisma.FraudFlagCreateWithoutTransactionInput[] | Prisma.FraudFlagUncheckedCreateWithoutTransactionInput[];
    connectOrCreate?: Prisma.FraudFlagCreateOrConnectWithoutTransactionInput | Prisma.FraudFlagCreateOrConnectWithoutTransactionInput[];
    upsert?: Prisma.FraudFlagUpsertWithWhereUniqueWithoutTransactionInput | Prisma.FraudFlagUpsertWithWhereUniqueWithoutTransactionInput[];
    createMany?: Prisma.FraudFlagCreateManyTransactionInputEnvelope;
    set?: Prisma.FraudFlagWhereUniqueInput | Prisma.FraudFlagWhereUniqueInput[];
    disconnect?: Prisma.FraudFlagWhereUniqueInput | Prisma.FraudFlagWhereUniqueInput[];
    delete?: Prisma.FraudFlagWhereUniqueInput | Prisma.FraudFlagWhereUniqueInput[];
    connect?: Prisma.FraudFlagWhereUniqueInput | Prisma.FraudFlagWhereUniqueInput[];
    update?: Prisma.FraudFlagUpdateWithWhereUniqueWithoutTransactionInput | Prisma.FraudFlagUpdateWithWhereUniqueWithoutTransactionInput[];
    updateMany?: Prisma.FraudFlagUpdateManyWithWhereWithoutTransactionInput | Prisma.FraudFlagUpdateManyWithWhereWithoutTransactionInput[];
    deleteMany?: Prisma.FraudFlagScalarWhereInput | Prisma.FraudFlagScalarWhereInput[];
};
export type FraudFlagUncheckedUpdateManyWithoutTransactionNestedInput = {
    create?: Prisma.XOR<Prisma.FraudFlagCreateWithoutTransactionInput, Prisma.FraudFlagUncheckedCreateWithoutTransactionInput> | Prisma.FraudFlagCreateWithoutTransactionInput[] | Prisma.FraudFlagUncheckedCreateWithoutTransactionInput[];
    connectOrCreate?: Prisma.FraudFlagCreateOrConnectWithoutTransactionInput | Prisma.FraudFlagCreateOrConnectWithoutTransactionInput[];
    upsert?: Prisma.FraudFlagUpsertWithWhereUniqueWithoutTransactionInput | Prisma.FraudFlagUpsertWithWhereUniqueWithoutTransactionInput[];
    createMany?: Prisma.FraudFlagCreateManyTransactionInputEnvelope;
    set?: Prisma.FraudFlagWhereUniqueInput | Prisma.FraudFlagWhereUniqueInput[];
    disconnect?: Prisma.FraudFlagWhereUniqueInput | Prisma.FraudFlagWhereUniqueInput[];
    delete?: Prisma.FraudFlagWhereUniqueInput | Prisma.FraudFlagWhereUniqueInput[];
    connect?: Prisma.FraudFlagWhereUniqueInput | Prisma.FraudFlagWhereUniqueInput[];
    update?: Prisma.FraudFlagUpdateWithWhereUniqueWithoutTransactionInput | Prisma.FraudFlagUpdateWithWhereUniqueWithoutTransactionInput[];
    updateMany?: Prisma.FraudFlagUpdateManyWithWhereWithoutTransactionInput | Prisma.FraudFlagUpdateManyWithWhereWithoutTransactionInput[];
    deleteMany?: Prisma.FraudFlagScalarWhereInput | Prisma.FraudFlagScalarWhereInput[];
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type EnumFraudStatusFieldUpdateOperationsInput = {
    set?: $Enums.FraudStatus;
};
export type FraudFlagCreateWithoutTransactionInput = {
    id?: string;
    reason: string;
    riskScore?: number;
    status?: $Enums.FraudStatus;
    reviewedBy?: string | null;
    reviewedAt?: Date | string | null;
    reviewNotes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FraudFlagUncheckedCreateWithoutTransactionInput = {
    id?: string;
    reason: string;
    riskScore?: number;
    status?: $Enums.FraudStatus;
    reviewedBy?: string | null;
    reviewedAt?: Date | string | null;
    reviewNotes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FraudFlagCreateOrConnectWithoutTransactionInput = {
    where: Prisma.FraudFlagWhereUniqueInput;
    create: Prisma.XOR<Prisma.FraudFlagCreateWithoutTransactionInput, Prisma.FraudFlagUncheckedCreateWithoutTransactionInput>;
};
export type FraudFlagCreateManyTransactionInputEnvelope = {
    data: Prisma.FraudFlagCreateManyTransactionInput | Prisma.FraudFlagCreateManyTransactionInput[];
    skipDuplicates?: boolean;
};
export type FraudFlagUpsertWithWhereUniqueWithoutTransactionInput = {
    where: Prisma.FraudFlagWhereUniqueInput;
    update: Prisma.XOR<Prisma.FraudFlagUpdateWithoutTransactionInput, Prisma.FraudFlagUncheckedUpdateWithoutTransactionInput>;
    create: Prisma.XOR<Prisma.FraudFlagCreateWithoutTransactionInput, Prisma.FraudFlagUncheckedCreateWithoutTransactionInput>;
};
export type FraudFlagUpdateWithWhereUniqueWithoutTransactionInput = {
    where: Prisma.FraudFlagWhereUniqueInput;
    data: Prisma.XOR<Prisma.FraudFlagUpdateWithoutTransactionInput, Prisma.FraudFlagUncheckedUpdateWithoutTransactionInput>;
};
export type FraudFlagUpdateManyWithWhereWithoutTransactionInput = {
    where: Prisma.FraudFlagScalarWhereInput;
    data: Prisma.XOR<Prisma.FraudFlagUpdateManyMutationInput, Prisma.FraudFlagUncheckedUpdateManyWithoutTransactionInput>;
};
export type FraudFlagScalarWhereInput = {
    AND?: Prisma.FraudFlagScalarWhereInput | Prisma.FraudFlagScalarWhereInput[];
    OR?: Prisma.FraudFlagScalarWhereInput[];
    NOT?: Prisma.FraudFlagScalarWhereInput | Prisma.FraudFlagScalarWhereInput[];
    id?: Prisma.StringFilter<"FraudFlag"> | string;
    transactionId?: Prisma.StringFilter<"FraudFlag"> | string;
    reason?: Prisma.StringFilter<"FraudFlag"> | string;
    riskScore?: Prisma.IntFilter<"FraudFlag"> | number;
    status?: Prisma.EnumFraudStatusFilter<"FraudFlag"> | $Enums.FraudStatus;
    reviewedBy?: Prisma.StringNullableFilter<"FraudFlag"> | string | null;
    reviewedAt?: Prisma.DateTimeNullableFilter<"FraudFlag"> | Date | string | null;
    reviewNotes?: Prisma.StringNullableFilter<"FraudFlag"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"FraudFlag"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"FraudFlag"> | Date | string;
};
export type FraudFlagCreateManyTransactionInput = {
    id?: string;
    reason: string;
    riskScore?: number;
    status?: $Enums.FraudStatus;
    reviewedBy?: string | null;
    reviewedAt?: Date | string | null;
    reviewNotes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FraudFlagUpdateWithoutTransactionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    riskScore?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumFraudStatusFieldUpdateOperationsInput | $Enums.FraudStatus;
    reviewedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reviewNotes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FraudFlagUncheckedUpdateWithoutTransactionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    riskScore?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumFraudStatusFieldUpdateOperationsInput | $Enums.FraudStatus;
    reviewedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reviewNotes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FraudFlagUncheckedUpdateManyWithoutTransactionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    riskScore?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumFraudStatusFieldUpdateOperationsInput | $Enums.FraudStatus;
    reviewedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reviewNotes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FraudFlagSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    transactionId?: boolean;
    reason?: boolean;
    riskScore?: boolean;
    status?: boolean;
    reviewedBy?: boolean;
    reviewedAt?: boolean;
    reviewNotes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    transaction?: boolean | Prisma.TransactionDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["fraudFlag"]>;
export type FraudFlagSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    transactionId?: boolean;
    reason?: boolean;
    riskScore?: boolean;
    status?: boolean;
    reviewedBy?: boolean;
    reviewedAt?: boolean;
    reviewNotes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    transaction?: boolean | Prisma.TransactionDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["fraudFlag"]>;
export type FraudFlagSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    transactionId?: boolean;
    reason?: boolean;
    riskScore?: boolean;
    status?: boolean;
    reviewedBy?: boolean;
    reviewedAt?: boolean;
    reviewNotes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    transaction?: boolean | Prisma.TransactionDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["fraudFlag"]>;
export type FraudFlagSelectScalar = {
    id?: boolean;
    transactionId?: boolean;
    reason?: boolean;
    riskScore?: boolean;
    status?: boolean;
    reviewedBy?: boolean;
    reviewedAt?: boolean;
    reviewNotes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type FraudFlagOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "transactionId" | "reason" | "riskScore" | "status" | "reviewedBy" | "reviewedAt" | "reviewNotes" | "createdAt" | "updatedAt", ExtArgs["result"]["fraudFlag"]>;
export type FraudFlagInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    transaction?: boolean | Prisma.TransactionDefaultArgs<ExtArgs>;
};
export type FraudFlagIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    transaction?: boolean | Prisma.TransactionDefaultArgs<ExtArgs>;
};
export type FraudFlagIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    transaction?: boolean | Prisma.TransactionDefaultArgs<ExtArgs>;
};
export type $FraudFlagPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "FraudFlag";
    objects: {
        transaction: Prisma.$TransactionPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        transactionId: string;
        reason: string;
        riskScore: number;
        status: $Enums.FraudStatus;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        reviewNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["fraudFlag"]>;
    composites: {};
};
export type FraudFlagGetPayload<S extends boolean | null | undefined | FraudFlagDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$FraudFlagPayload, S>;
export type FraudFlagCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<FraudFlagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FraudFlagCountAggregateInputType | true;
};
export interface FraudFlagDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['FraudFlag'];
        meta: {
            name: 'FraudFlag';
        };
    };
    /**
     * Find zero or one FraudFlag that matches the filter.
     * @param {FraudFlagFindUniqueArgs} args - Arguments to find a FraudFlag
     * @example
     * // Get one FraudFlag
     * const fraudFlag = await prisma.fraudFlag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FraudFlagFindUniqueArgs>(args: Prisma.SelectSubset<T, FraudFlagFindUniqueArgs<ExtArgs>>): Prisma.Prisma__FraudFlagClient<runtime.Types.Result.GetResult<Prisma.$FraudFlagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one FraudFlag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FraudFlagFindUniqueOrThrowArgs} args - Arguments to find a FraudFlag
     * @example
     * // Get one FraudFlag
     * const fraudFlag = await prisma.fraudFlag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FraudFlagFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, FraudFlagFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__FraudFlagClient<runtime.Types.Result.GetResult<Prisma.$FraudFlagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first FraudFlag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FraudFlagFindFirstArgs} args - Arguments to find a FraudFlag
     * @example
     * // Get one FraudFlag
     * const fraudFlag = await prisma.fraudFlag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FraudFlagFindFirstArgs>(args?: Prisma.SelectSubset<T, FraudFlagFindFirstArgs<ExtArgs>>): Prisma.Prisma__FraudFlagClient<runtime.Types.Result.GetResult<Prisma.$FraudFlagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first FraudFlag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FraudFlagFindFirstOrThrowArgs} args - Arguments to find a FraudFlag
     * @example
     * // Get one FraudFlag
     * const fraudFlag = await prisma.fraudFlag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FraudFlagFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, FraudFlagFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__FraudFlagClient<runtime.Types.Result.GetResult<Prisma.$FraudFlagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more FraudFlags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FraudFlagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FraudFlags
     * const fraudFlags = await prisma.fraudFlag.findMany()
     *
     * // Get first 10 FraudFlags
     * const fraudFlags = await prisma.fraudFlag.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const fraudFlagWithIdOnly = await prisma.fraudFlag.findMany({ select: { id: true } })
     *
     */
    findMany<T extends FraudFlagFindManyArgs>(args?: Prisma.SelectSubset<T, FraudFlagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FraudFlagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a FraudFlag.
     * @param {FraudFlagCreateArgs} args - Arguments to create a FraudFlag.
     * @example
     * // Create one FraudFlag
     * const FraudFlag = await prisma.fraudFlag.create({
     *   data: {
     *     // ... data to create a FraudFlag
     *   }
     * })
     *
     */
    create<T extends FraudFlagCreateArgs>(args: Prisma.SelectSubset<T, FraudFlagCreateArgs<ExtArgs>>): Prisma.Prisma__FraudFlagClient<runtime.Types.Result.GetResult<Prisma.$FraudFlagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many FraudFlags.
     * @param {FraudFlagCreateManyArgs} args - Arguments to create many FraudFlags.
     * @example
     * // Create many FraudFlags
     * const fraudFlag = await prisma.fraudFlag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends FraudFlagCreateManyArgs>(args?: Prisma.SelectSubset<T, FraudFlagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many FraudFlags and returns the data saved in the database.
     * @param {FraudFlagCreateManyAndReturnArgs} args - Arguments to create many FraudFlags.
     * @example
     * // Create many FraudFlags
     * const fraudFlag = await prisma.fraudFlag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many FraudFlags and only return the `id`
     * const fraudFlagWithIdOnly = await prisma.fraudFlag.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends FraudFlagCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, FraudFlagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FraudFlagPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a FraudFlag.
     * @param {FraudFlagDeleteArgs} args - Arguments to delete one FraudFlag.
     * @example
     * // Delete one FraudFlag
     * const FraudFlag = await prisma.fraudFlag.delete({
     *   where: {
     *     // ... filter to delete one FraudFlag
     *   }
     * })
     *
     */
    delete<T extends FraudFlagDeleteArgs>(args: Prisma.SelectSubset<T, FraudFlagDeleteArgs<ExtArgs>>): Prisma.Prisma__FraudFlagClient<runtime.Types.Result.GetResult<Prisma.$FraudFlagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one FraudFlag.
     * @param {FraudFlagUpdateArgs} args - Arguments to update one FraudFlag.
     * @example
     * // Update one FraudFlag
     * const fraudFlag = await prisma.fraudFlag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends FraudFlagUpdateArgs>(args: Prisma.SelectSubset<T, FraudFlagUpdateArgs<ExtArgs>>): Prisma.Prisma__FraudFlagClient<runtime.Types.Result.GetResult<Prisma.$FraudFlagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more FraudFlags.
     * @param {FraudFlagDeleteManyArgs} args - Arguments to filter FraudFlags to delete.
     * @example
     * // Delete a few FraudFlags
     * const { count } = await prisma.fraudFlag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends FraudFlagDeleteManyArgs>(args?: Prisma.SelectSubset<T, FraudFlagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more FraudFlags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FraudFlagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FraudFlags
     * const fraudFlag = await prisma.fraudFlag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends FraudFlagUpdateManyArgs>(args: Prisma.SelectSubset<T, FraudFlagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more FraudFlags and returns the data updated in the database.
     * @param {FraudFlagUpdateManyAndReturnArgs} args - Arguments to update many FraudFlags.
     * @example
     * // Update many FraudFlags
     * const fraudFlag = await prisma.fraudFlag.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more FraudFlags and only return the `id`
     * const fraudFlagWithIdOnly = await prisma.fraudFlag.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends FraudFlagUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, FraudFlagUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FraudFlagPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one FraudFlag.
     * @param {FraudFlagUpsertArgs} args - Arguments to update or create a FraudFlag.
     * @example
     * // Update or create a FraudFlag
     * const fraudFlag = await prisma.fraudFlag.upsert({
     *   create: {
     *     // ... data to create a FraudFlag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FraudFlag we want to update
     *   }
     * })
     */
    upsert<T extends FraudFlagUpsertArgs>(args: Prisma.SelectSubset<T, FraudFlagUpsertArgs<ExtArgs>>): Prisma.Prisma__FraudFlagClient<runtime.Types.Result.GetResult<Prisma.$FraudFlagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of FraudFlags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FraudFlagCountArgs} args - Arguments to filter FraudFlags to count.
     * @example
     * // Count the number of FraudFlags
     * const count = await prisma.fraudFlag.count({
     *   where: {
     *     // ... the filter for the FraudFlags we want to count
     *   }
     * })
    **/
    count<T extends FraudFlagCountArgs>(args?: Prisma.Subset<T, FraudFlagCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], FraudFlagCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a FraudFlag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FraudFlagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FraudFlagAggregateArgs>(args: Prisma.Subset<T, FraudFlagAggregateArgs>): Prisma.PrismaPromise<GetFraudFlagAggregateType<T>>;
    /**
     * Group by FraudFlag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FraudFlagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends FraudFlagGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: FraudFlagGroupByArgs['orderBy'];
    } : {
        orderBy?: FraudFlagGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, FraudFlagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFraudFlagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the FraudFlag model
     */
    readonly fields: FraudFlagFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for FraudFlag.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__FraudFlagClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    transaction<T extends Prisma.TransactionDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TransactionDefaultArgs<ExtArgs>>): Prisma.Prisma__TransactionClient<runtime.Types.Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the FraudFlag model
 */
export interface FraudFlagFieldRefs {
    readonly id: Prisma.FieldRef<"FraudFlag", 'String'>;
    readonly transactionId: Prisma.FieldRef<"FraudFlag", 'String'>;
    readonly reason: Prisma.FieldRef<"FraudFlag", 'String'>;
    readonly riskScore: Prisma.FieldRef<"FraudFlag", 'Int'>;
    readonly status: Prisma.FieldRef<"FraudFlag", 'FraudStatus'>;
    readonly reviewedBy: Prisma.FieldRef<"FraudFlag", 'String'>;
    readonly reviewedAt: Prisma.FieldRef<"FraudFlag", 'DateTime'>;
    readonly reviewNotes: Prisma.FieldRef<"FraudFlag", 'String'>;
    readonly createdAt: Prisma.FieldRef<"FraudFlag", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"FraudFlag", 'DateTime'>;
}
/**
 * FraudFlag findUnique
 */
export type FraudFlagFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudFlag
     */
    select?: Prisma.FraudFlagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FraudFlag
     */
    omit?: Prisma.FraudFlagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FraudFlagInclude<ExtArgs> | null;
    /**
     * Filter, which FraudFlag to fetch.
     */
    where: Prisma.FraudFlagWhereUniqueInput;
};
/**
 * FraudFlag findUniqueOrThrow
 */
export type FraudFlagFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudFlag
     */
    select?: Prisma.FraudFlagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FraudFlag
     */
    omit?: Prisma.FraudFlagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FraudFlagInclude<ExtArgs> | null;
    /**
     * Filter, which FraudFlag to fetch.
     */
    where: Prisma.FraudFlagWhereUniqueInput;
};
/**
 * FraudFlag findFirst
 */
export type FraudFlagFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudFlag
     */
    select?: Prisma.FraudFlagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FraudFlag
     */
    omit?: Prisma.FraudFlagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FraudFlagInclude<ExtArgs> | null;
    /**
     * Filter, which FraudFlag to fetch.
     */
    where?: Prisma.FraudFlagWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FraudFlags to fetch.
     */
    orderBy?: Prisma.FraudFlagOrderByWithRelationInput | Prisma.FraudFlagOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for FraudFlags.
     */
    cursor?: Prisma.FraudFlagWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FraudFlags from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FraudFlags.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of FraudFlags.
     */
    distinct?: Prisma.FraudFlagScalarFieldEnum | Prisma.FraudFlagScalarFieldEnum[];
};
/**
 * FraudFlag findFirstOrThrow
 */
export type FraudFlagFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudFlag
     */
    select?: Prisma.FraudFlagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FraudFlag
     */
    omit?: Prisma.FraudFlagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FraudFlagInclude<ExtArgs> | null;
    /**
     * Filter, which FraudFlag to fetch.
     */
    where?: Prisma.FraudFlagWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FraudFlags to fetch.
     */
    orderBy?: Prisma.FraudFlagOrderByWithRelationInput | Prisma.FraudFlagOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for FraudFlags.
     */
    cursor?: Prisma.FraudFlagWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FraudFlags from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FraudFlags.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of FraudFlags.
     */
    distinct?: Prisma.FraudFlagScalarFieldEnum | Prisma.FraudFlagScalarFieldEnum[];
};
/**
 * FraudFlag findMany
 */
export type FraudFlagFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudFlag
     */
    select?: Prisma.FraudFlagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FraudFlag
     */
    omit?: Prisma.FraudFlagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FraudFlagInclude<ExtArgs> | null;
    /**
     * Filter, which FraudFlags to fetch.
     */
    where?: Prisma.FraudFlagWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FraudFlags to fetch.
     */
    orderBy?: Prisma.FraudFlagOrderByWithRelationInput | Prisma.FraudFlagOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing FraudFlags.
     */
    cursor?: Prisma.FraudFlagWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FraudFlags from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FraudFlags.
     */
    skip?: number;
    distinct?: Prisma.FraudFlagScalarFieldEnum | Prisma.FraudFlagScalarFieldEnum[];
};
/**
 * FraudFlag create
 */
export type FraudFlagCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudFlag
     */
    select?: Prisma.FraudFlagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FraudFlag
     */
    omit?: Prisma.FraudFlagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FraudFlagInclude<ExtArgs> | null;
    /**
     * The data needed to create a FraudFlag.
     */
    data: Prisma.XOR<Prisma.FraudFlagCreateInput, Prisma.FraudFlagUncheckedCreateInput>;
};
/**
 * FraudFlag createMany
 */
export type FraudFlagCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many FraudFlags.
     */
    data: Prisma.FraudFlagCreateManyInput | Prisma.FraudFlagCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * FraudFlag createManyAndReturn
 */
export type FraudFlagCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudFlag
     */
    select?: Prisma.FraudFlagSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the FraudFlag
     */
    omit?: Prisma.FraudFlagOmit<ExtArgs> | null;
    /**
     * The data used to create many FraudFlags.
     */
    data: Prisma.FraudFlagCreateManyInput | Prisma.FraudFlagCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FraudFlagIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * FraudFlag update
 */
export type FraudFlagUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudFlag
     */
    select?: Prisma.FraudFlagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FraudFlag
     */
    omit?: Prisma.FraudFlagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FraudFlagInclude<ExtArgs> | null;
    /**
     * The data needed to update a FraudFlag.
     */
    data: Prisma.XOR<Prisma.FraudFlagUpdateInput, Prisma.FraudFlagUncheckedUpdateInput>;
    /**
     * Choose, which FraudFlag to update.
     */
    where: Prisma.FraudFlagWhereUniqueInput;
};
/**
 * FraudFlag updateMany
 */
export type FraudFlagUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update FraudFlags.
     */
    data: Prisma.XOR<Prisma.FraudFlagUpdateManyMutationInput, Prisma.FraudFlagUncheckedUpdateManyInput>;
    /**
     * Filter which FraudFlags to update
     */
    where?: Prisma.FraudFlagWhereInput;
    /**
     * Limit how many FraudFlags to update.
     */
    limit?: number;
};
/**
 * FraudFlag updateManyAndReturn
 */
export type FraudFlagUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudFlag
     */
    select?: Prisma.FraudFlagSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the FraudFlag
     */
    omit?: Prisma.FraudFlagOmit<ExtArgs> | null;
    /**
     * The data used to update FraudFlags.
     */
    data: Prisma.XOR<Prisma.FraudFlagUpdateManyMutationInput, Prisma.FraudFlagUncheckedUpdateManyInput>;
    /**
     * Filter which FraudFlags to update
     */
    where?: Prisma.FraudFlagWhereInput;
    /**
     * Limit how many FraudFlags to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FraudFlagIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * FraudFlag upsert
 */
export type FraudFlagUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudFlag
     */
    select?: Prisma.FraudFlagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FraudFlag
     */
    omit?: Prisma.FraudFlagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FraudFlagInclude<ExtArgs> | null;
    /**
     * The filter to search for the FraudFlag to update in case it exists.
     */
    where: Prisma.FraudFlagWhereUniqueInput;
    /**
     * In case the FraudFlag found by the `where` argument doesn't exist, create a new FraudFlag with this data.
     */
    create: Prisma.XOR<Prisma.FraudFlagCreateInput, Prisma.FraudFlagUncheckedCreateInput>;
    /**
     * In case the FraudFlag was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.FraudFlagUpdateInput, Prisma.FraudFlagUncheckedUpdateInput>;
};
/**
 * FraudFlag delete
 */
export type FraudFlagDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudFlag
     */
    select?: Prisma.FraudFlagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FraudFlag
     */
    omit?: Prisma.FraudFlagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FraudFlagInclude<ExtArgs> | null;
    /**
     * Filter which FraudFlag to delete.
     */
    where: Prisma.FraudFlagWhereUniqueInput;
};
/**
 * FraudFlag deleteMany
 */
export type FraudFlagDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which FraudFlags to delete
     */
    where?: Prisma.FraudFlagWhereInput;
    /**
     * Limit how many FraudFlags to delete.
     */
    limit?: number;
};
/**
 * FraudFlag without action
 */
export type FraudFlagDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudFlag
     */
    select?: Prisma.FraudFlagSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FraudFlag
     */
    omit?: Prisma.FraudFlagOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FraudFlagInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=FraudFlag.d.ts.map