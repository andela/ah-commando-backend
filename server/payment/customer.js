import Stripe from 'stripe';

const stripe = Stripe(process.env.SECRET_KEY_STRIPE);

export const createCustomer = async (body) => {
  const {
    firstname, lastname, token, email
  } = body;
  const customer = await stripe.customers.create({
    name: `${firstname} ${lastname}`,
    email,
    source: token.id,
  });
  return customer;
};

export const deleteCustomer = async (customerId) => {
  const deletedCustomer = await stripe.customers.del(customerId);
  return deletedCustomer;
};
