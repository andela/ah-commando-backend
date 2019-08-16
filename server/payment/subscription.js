import Stripe from 'stripe';

const stripe = Stripe(process.env.SECRET_KEY_STRIPE);

export const createSubscription = async (customer, plan) => {
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    trial_period_days: 0,
    items: [
      {
        plan,
      }
    ]
  });
  return subscription;
};
export const getAllSubscriptions = async () => {
  const subscriptions = await stripe.subscriptions.list();
  return subscriptions;
};

export const cancelSubscription = async (subscriptionId) => {
  const canceledSubscription = await stripe.subscriptions.del(subscriptionId);
  return canceledSubscription;
};
