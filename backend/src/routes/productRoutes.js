const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Seller
router.post('/', protect, productController.createProduct); // Sellers (and admins implicitly via role check in controller or specific middleware)

// @route   GET /api/products
// @desc    Get all approved products with filtering, sorting, pagination
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET /api/products/admin
// @desc    Get all products (admin view, including unapproved) with filtering, sorting, pagination
// @access  Private/Admin
router.get('/admin', protect, admin, productController.adminGetAllProducts);

// @route   GET /api/products/:id
// @desc    Get a single product by ID (must be approved)
// @access  Public
router.get('/:id', productController.getProductById);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Seller or Private/Admin
router.put('/:id', protect, productController.updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Seller or Private/Admin
router.delete('/:id', protect, productController.deleteProduct);

// @route   PATCH /api/products/:id/approve
// @desc    Approve a product
// @access  Private/Admin
router.patch('/:id/approve', protect, admin, productController.adminApproveProduct);

module.exports = router;
