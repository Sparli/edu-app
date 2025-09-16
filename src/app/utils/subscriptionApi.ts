import { API_BASE_URL } from "@/app/config";

// Types for plan data
export interface Plan {
  id: "monthly" | "yearly";
  name: string;
  interval: "month" | "year";
  cost_per_month: string;
  price: string;
  currency: "USD";
}

export interface PlanResponse {
  success: boolean;
  plan: Plan;
}

export interface PlanError {
  success: false;
  error: string;
  valid: string[];
  default: string;
}

// Types for checkout session
export interface CheckoutSessionRequest {
  id: "monthly" | "yearly";
}

export interface CheckoutSessionResponse {
  success: boolean;
  checkout_url?: string;
  error?: string;
}

// Types for cancel subscription
export interface CancelSubscriptionResponse {
  success: boolean;
  mode: "immediately";
  effective_end: string;
  error?: string;
}

// API function to fetch plan details
export const getPlanDetails = async (planId?: "monthly" | "yearly"): Promise<PlanResponse> => {
  try {
    const accessToken = localStorage.getItem("access");
    
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const url = planId 
      ? `${API_BASE_URL}/billing/plans/?id=${planId.toLowerCase()}`
      : `${API_BASE_URL}/billing/plans/`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Invalid plan ID, fallback to yearly
        const fallbackResponse = await fetch(`${API_BASE_URL}/billing/plans/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        
        if (!fallbackResponse.ok) {
          throw new Error('Failed to fetch plan details');
        }
        
        return await fallbackResponse.json();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PlanResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching plan details:', error);
    throw error;
  }
};

// API function to create Stripe checkout session
export const createCheckoutSession = async (planId: "monthly" | "yearly"): Promise<CheckoutSessionResponse> => {
  try {
    const accessToken = localStorage.getItem("access");
    
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await fetch(`${API_BASE_URL}/billing/create-checkout-session/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        id: planId
      }),
    });

    const data: CheckoutSessionResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// API function to cancel subscription immediately
export const cancelSubscription = async (): Promise<CancelSubscriptionResponse> => {
  try {
    const accessToken = localStorage.getItem("access");
    
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }

    const response = await fetch(`${API_BASE_URL}/billing/cancel-subscription/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({}),
    });

    const data: CancelSubscriptionResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};
