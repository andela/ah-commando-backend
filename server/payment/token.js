/* eslint-disable camelcase */
import Stripe from 'stripe';

const stripe = Stripe(process.env.SECRET_KEY_STRIPE);

export const createToken = async (card) => {
  const {
    cardNumber, exp_month, exp_year, cvc
  } = card;
  const token = await stripe.tokens.create({
    card: {
      number: cardNumber,
      exp_month,
      exp_year,
      cvc
    }
  });
  return token;
};

export default createToken;
