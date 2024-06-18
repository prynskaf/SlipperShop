import express from 'express';
import { createOrder, deleteOrder, getOrderById, getOrders, updateOrder } from '../controllers/orderController';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/productController';
import { createReview, deleteReview, getReviewsByProduct, updateReview } from '../controllers/reviewController';
import { getPaymentById, getPayments, processPayment } from '../controllers/paymentController';
import { getUser, loginUser, logoutUser, registerUser } from '../controllers/userController';
import { deleteUserAccount, getUserSettings, updateUserSettings } from '../controllers/settingsController';
import { createAddress, deleteAddress, getAddressesByUser, updateAddress } from '../controllers/addressController'; // Import address controller
import { createCategory, deleteCategory, getCategories, updateCategory } from '../controllers/categoryController'; // Import category controllers
import { addOrderItem, deleteOrderItem, getOrderItemsByOrder, updateOrderItem } from '../controllers/orderItemController'; // Import order item controllers
import authenticateToken from '../middleware /authMiddleware';
import { addProductSize, deleteProductSize, getProductSizes, updateProductSize } from '../controllers/productSizeController';


const router = express.Router();

// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authenticateToken, logoutUser);
router.get('/users', getUser);

// Product routes
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', authenticateToken, createProduct);
router.put('/products/:id', authenticateToken, updateProduct);
router.delete('/products/:id', authenticateToken, deleteProduct);

// Order routes
router.post('/orders', authenticateToken, createOrder);
router.get('/orders', authenticateToken, getOrders);
router.get('/orders/:id', authenticateToken, getOrderById);
router.put('/orders/:id', authenticateToken, updateOrder);
router.delete('/orders/:id', authenticateToken, deleteOrder);

// User settings routes
router.get('/settings', authenticateToken, getUserSettings);
router.put('/settings', authenticateToken, updateUserSettings);
router.delete('/settings', authenticateToken, deleteUserAccount);

// Review routes
router.get('/products/:productId/reviews', getReviewsByProduct);
router.post('/products/:productId/reviews', authenticateToken, createReview);
router.put('/reviews/:id', authenticateToken, updateReview);
router.delete('/reviews/:id', authenticateToken, deleteReview);

// Payment routes
router.get('/payments', getPayments);
router.get('/payments/:id', authenticateToken, getPaymentById);
router.post('/payments', authenticateToken, processPayment);

// Address routes
router.post('/addresses', authenticateToken, createAddress);
router.get('/addresses', authenticateToken, getAddressesByUser);
router.put('/addresses/:id', authenticateToken, updateAddress);
router.delete('/addresses/:id', authenticateToken, deleteAddress);

// Product size routes
router.get('/products/:productId/sizes', authenticateToken, getProductSizes);
router.post('/products/:productId/sizes', authenticateToken, addProductSize);
router.put('/product-sizes/:id', authenticateToken, updateProductSize);
router.delete('/product-sizes/:id', authenticateToken, deleteProductSize);

// Category routes
router.get('/categories', getCategories);
router.post('/categories', authenticateToken, createCategory);
router.put('/categories/:id', authenticateToken, updateCategory);
router.delete('/categories/:id', authenticateToken, deleteCategory);

// Order item routes
router.post('/orders/:orderId/items', authenticateToken, addOrderItem);
router.get('/orders/:orderId/items', authenticateToken, getOrderItemsByOrder);
router.put('/order-items/:id', authenticateToken, updateOrderItem);
router.delete('/order-items/:id', authenticateToken, deleteOrderItem);

export default router;
