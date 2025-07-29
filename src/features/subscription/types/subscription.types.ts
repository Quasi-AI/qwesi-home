export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "monthly" | "yearly";
  features: string[];
  isPopular?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "bank";
  last4: string;
  brand?: string;
  expiryDate?: string;
  isDefault: boolean;
}

export interface Subscription {
  id: string;
  planId: string;
  status: "active" | "canceled" | "past_due" | "unpaid";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  paymentMethod: PaymentMethod;
}

export interface SubscriptionState {
  currentSubscription: Subscription | null;
  availablePlans: SubscriptionPlan[];
  loading: boolean;
  error: string | null;
}

export interface SubscriptionResponse {
  success: boolean;
  subscription?: Subscription;
  plans?: SubscriptionPlan[];
  checkoutUrl?: string;
  message?: string;
}

export interface CreateSubscriptionData {
  planId: string;
  paymentMethodId: string;
}

export interface UpdatePaymentMethodData {
  paymentMethodId: string;
}

export interface CheckoutData {
  email: string;
}

export interface CancelSubscriptionData {
  email: string;
}
