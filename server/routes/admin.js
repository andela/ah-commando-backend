import express from 'express';
import 'express-async-errors';
import AdminController from '../controllers/adminController';
import middlewares from '../middlewares';


const {
  verifyToken, isActive, isJustAUser, validateRoleInput, validateParamsInput, validateNewUser,
  validateUpdateUser, validateGetUser
} = middlewares;

const {
  assignRole, setActiveStatus, deleteAUser, deleteAnArticle, deleteAComment, getASingleUser,
  createUser, updateUser, getUser
} = AdminController;
const adminRoute = express();

adminRoute.put('/assignRole', verifyToken, isActive, isJustAUser, validateRoleInput, assignRole);
adminRoute.put('/setActiveStatus/:username', verifyToken, isActive, isJustAUser, validateParamsInput, setActiveStatus);
adminRoute.delete('/deleteUser/:username', verifyToken, isActive, isJustAUser, validateParamsInput, deleteAUser);
adminRoute.post('/user/', verifyToken, isActive, isJustAUser, validateNewUser, createUser);
adminRoute.patch('/user/:id', verifyToken, isActive, isJustAUser, validateUpdateUser, updateUser);
adminRoute.get('/user/:id', verifyToken, isActive, isJustAUser, validateGetUser, getUser);
adminRoute.delete('/deleteArticle/:id', verifyToken, isActive, isJustAUser, validateParamsInput, deleteAnArticle);
adminRoute.delete('/deleteComment/:id', verifyToken, isActive, isJustAUser, validateParamsInput, deleteAComment);
adminRoute.get('/getUser/:username', verifyToken, isActive, isJustAUser, validateParamsInput, getASingleUser);

export default adminRoute;
