export interface PaymentInitializeParams {
  amount: number;
  email: string;
  reference: string;
  callbackUrl: string;
  metadata?: any;
}

export interface PaymentInitializeResult {
  checkoutUrl: string;
  reference: string;
}

export interface PaymentProvider {
  initialize(params: PaymentInitializeParams): Promise<PaymentInitializeResult>;
  verify(reference: string): Promise<boolean>;
}
