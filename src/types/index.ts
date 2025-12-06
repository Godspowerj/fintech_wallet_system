import { Request } from 'express';
import { JwtPayload } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface TransactionFilter {
  startDate?: string;
  endDate?: string;
  type?: string;
  status?: string;
  minAmount?: string;
  maxAmount?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: any;
  error?: string;
}

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  services: {
    database: 'connected' | 'disconnected';
    redis: 'connected' | 'disconnected';
  };
}

export interface FraudCheckResult {
  isFraud: boolean;
  reason?: string;
  riskScore: number;
}

export interface TransferRequest {
  senderWalletId: string;
  receiverWalletId: string;
  amount: number;
  description?: string;
  idempotencyKey?: string;
}

export interface DepositRequest {
  walletId: string;
  amount: number;
  description?: string;
  idempotencyKey?: string;
}

export interface WithdrawalRequest {
  walletId: string;
  amount: number;
  description?: string;
  idempotencyKey?: string;
}