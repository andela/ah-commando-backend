import express from 'express';
import AdminController from '../controllers/adminController';
import middlewares from '../middlewares';


const {
  verifyToken, isActive, isJustAUser, validateRoleInput, validateParamsInput
} = middlewares;

const {
  assignRole, setActiveStatus, deleteAUser, deleteAnArticle, deleteAComment
} = AdminController;
const adminRoute = express();

adminRoute.put('/assignRole', verifyToken, isActive, isJustAUser, validateRoleInput, assignRole);
adminRoute.put('/setActiveStatus/:username', verifyToken, isActive, isJustAUser, validateParamsInput, setActiveStatus);
adminRoute.delete('/deleteUser/:username', verifyToken, isActive, isJustAUser, validateParamsInput, deleteAUser);
adminRoute.delete('/deleteArticle/:id', verifyToken, isActive, isJustAUser, validateParamsInput, deleteAnArticle);
adminRoute.delete('/deleteComment/:id', verifyToken, isActive, isJustAUser, validateParamsInput, deleteAComment);

export default adminRoute;
