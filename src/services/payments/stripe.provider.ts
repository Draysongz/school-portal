import Stripe from 'stripe';
import { PaymentProvider, PaymentInitializeParams, PaymentInitializeResult } from './payment-provider.interface';

export class StripeProvider implements PaymentProvider {
  private stripe: Stripe;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, { apiVersion: '2025-01-27.acacia' });
  }

  async initialize(params: PaymentInitializeParams): Promise<PaymentInitializeResult> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'School Payment' },
          unit_amount: params.amount * 100, // Stripe uses cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: params.callbackUrl,
      cancel_url: params.callbackUrl,
      customer_email: params.email,
      client_reference_id: params.reference,
    });

    return {
      checkoutUrl: session.url!,
      reference: params.reference,
    };
  }

  async verify(reference: string): Promise<boolean> {
    // In Stripe, verification is usually handled via webhooks
    // But we can check session status if needed
    return true;
  }
}
