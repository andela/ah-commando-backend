import express from 'express';
import PaymentController from '../controllers/paymentController';
import middlewares from '../middlewares';

const {
  verifyToken, validateSubscription, validateUnSubscribe,
  validateCreateToken, validatePlan, validateDeletePlan
} = middlewares;
const paymentRoute = express();
const {
  subscribe, unSubscribe, getSubscription, createPlan, deletePlan, getPlan,
  deleteCustomer, createToken
} = PaymentController;

// create a subscritpion
paymentRoute.post('/subscription', validateSubscription, verifyToken, subscribe);

// delete a subscription
paymentRoute.delete('/subscription/:id', validateUnSubscribe, verifyToken, unSubscribe);

// get all subscription
paymentRoute.get('/subscription', verifyToken, getSubscription);

// create a plan
paymentRoute.post('/plan', validatePlan, verifyToken, createPlan);

// delete a plan
paymentRoute.delete('/plan/:id', verifyToken, deletePlan);

// get all plans
paymentRoute.get('/plan', verifyToken, getPlan);

// delete a customer
paymentRoute.delete('/customer', validateDeletePlan, verifyToken, deleteCustomer);

// create a token
paymentRoute.post('/token', validateCreateToken, verifyToken, createToken);
export default paymentRoute;
