import Stripe from 'stripe';

const stripe = Stripe(process.env.SECRET_KEY_STRIPE);

export const createPlan = async (body) => {
  const {
    amount, interval, name, currency
  } = body;

  const newPlan = await stripe.plans.create({
    amount,
    interval,
    product: {
      name
    },
    currency
  });
  return newPlan;
};

export const getAllPlans = async () => {
  const plans = await stripe.plans.list();
  return plans;
};

export const deletePlan = async (planId) => {
  const deletedPlan = await stripe.plans.del(planId);
  return deletedPlan;
};
