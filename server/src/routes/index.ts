import express from 'express';
import { createOrder, deleteOrder, getOrderById, getOrders, updateOrder } from '../controllers/orderController';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/productController';
import { createReview, deleteReview, getReviewsByProduct, updateReview } from '../controllers/reviewController';
import { getPaymentById, getPayments, processPayment } from '../controllers/paymentController';
import { deleteUser, getAllUsers, getUser, loginUser, logoutUser, registerUser, updateUser } from '../controllers/userController';
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

// Authenticated routes
router.post('/logout', authenticateToken, logoutUser);
router.get('/users/:id', authenticateToken, getUser);
router.put('/users/:id', authenticateToken, updateUser);
router.delete('/users/:id', authenticateToken, deleteUser);
router.get('/users', authenticateToken, getAllUsers);

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
router.get('/settings/:id', authenticateToken, getUserSettings);
router.put('/settings/:id', authenticateToken, updateUserSettings);
router.delete('/settings/:id', authenticateToken, deleteUserAccount);

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
// POST /api/products/:productId/sizes - Add a product size (requires authentication)
router.post('/:productId/sizes', authenticateToken, addProductSize);
// GET /api/products/:productId/sizes - Get all product sizes by productId
router.get('/:productId/sizes', getProductSizes);
// PUT /api/products/sizes/:id - Update a product size by id (requires authentication)
router.put('/sizes/:id', authenticateToken, updateProductSize);
// DELETE /api/products/sizes/:id - Delete a product size by id (requires authentication)
router.delete('/sizes/:id', authenticateToken, deleteProductSize);

// Category routes
router.get('/categories', getCategories);
router.post('/categories', authenticateToken, createCategory);
router.put('/categories/:id', authenticateToken, updateCategory);
router.delete('/categories/:id', authenticateToken, deleteCategory);

// Order item routes
router.post('/orders/:orderId/order_items', addOrderItem);
router.get('/orders/:orderId/order_items', getOrderItemsByOrder);
router.put('/order_items/:id', updateOrderItem);
router.delete('/order_items/:id', deleteOrderItem);

export default router;
