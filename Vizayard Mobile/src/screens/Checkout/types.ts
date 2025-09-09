export interface SuccessResponse {
  razorpay_signature: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
}

export interface ErrorResponse {
  code: number;
  description: string;
  error: {
    field?: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      payment_id?: string;
      order_id: string;
    };
  };
}
