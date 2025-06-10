const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private/Buyer
router.post('/', protect, orderController.createOrder); // Buyers create orders

// @route   GET /api/orders/my-orders
// @desc    Get logged-in user's orders
// @access  Private/Buyer
router.get('/my-orders', protect, orderController.getUserOrders);

// @route   GET /api/orders/seller-orders
// @desc    Get logged-in seller's orders (or specific seller's orders for admin)
// @access  Private/Seller or Private/Admin
router.get('/seller-orders', protect, orderController.getSellerOrders); // Gets orders for the logged-in seller

// @route   GET /api/orders/seller-orders/:sellerId
// @desc    Get orders for a specific seller (Admin only)
// @access  Private/Admin
router.get('/seller-orders/:sellerId', protect, admin, orderController.getSellerOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private (Buyer who owns, Seller involved, or Admin)
router.get('/:id', protect, orderController.getOrderById);

// @route   PATCH /api/orders/:id/status
// @desc    Update order status
// @access  Private (Seller involved or Admin)
router.patch('/:id/status', protect, orderController.updateOrderStatus);

module.exports = router;
