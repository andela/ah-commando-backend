import { createCustomer, deleteCustomer } from './customer';
import { createSubscription, cancelSubscription, getAllSubscriptions } from './subscription';
import { getAllPlans, createPlan, deletePlan } from './plan';
import { createToken } from './token';

export default {
  createCustomer,
  deleteCustomer,
  createSubscription,
  cancelSubscription,
  getAllSubscriptions,
  createPlan,
  getAllPlans,
  deletePlan,
  createToken
};
