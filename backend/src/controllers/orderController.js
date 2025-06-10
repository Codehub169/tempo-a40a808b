const asyncHandler = require('express-async-handler');
const Order = require('../models/Order'); 
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product'); // Needed for fetching product details like sellerId and price during order creation

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (typically Buyer role)
const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, paymentDetails } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items provided');
    }
    if (!shippingAddress) {
        res.status(400);
        throw new Error('Shipping address is required');
    }

    // Server-side calculation of totalAmount and enrichment of orderItems
    let calculatedTotalAmount = 0;
    const enrichedOrderItems = [];

    for (const item of orderItems) {
        const product = await Product.findById(item.productId);
        if (!product) {
            res.status(404);
            throw new Error(`Product with ID ${item.productId} not found`);
        }
        if (product.stockQuantity < item.quantity) {
            res.status(400);
            throw new Error(`Not enough stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`);
        }
        
        const priceAtPurchase = product.discountedPrice || product.price; // Use discounted if available
        calculatedTotalAmount += priceAtPurchase * item.quantity;
        enrichedOrderItems.push({
            productId: product.id,
            sellerId: product.sellerId, // Get sellerId from the authoritative product record
            quantity: item.quantity,
            priceAtPurchase: priceAtPurchase,
        });
    }

    const orderData = {
        userId: req.user.id,
        totalAmount: calculatedTotalAmount,
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod: paymentMethod || 'N/A',
        paymentDetails: paymentDetails ? JSON.stringify(paymentDetails) : null,
        paymentStatus: paymentDetails ? 'paid' : 'pending', // Basic logic, payment verification is separate
        orderStatus: 'pending', // Initial status
    };

    const createdOrder = await Order.create(orderData);

    if (!createdOrder || !createdOrder.id) {
        res.status(500);
        throw new Error('Failed to create order record');
    }

    for (const enrichedItem of enrichedOrderItems) {
        await OrderItem.create({
            orderId: createdOrder.id,
            ...enrichedItem,
        });
        // Update product stock
        await Product.updateStock(enrichedItem.productId, product.stockQuantity - enrichedItem.quantity);
    }
    
    const fullOrder = await Order.findByIdWithItems(createdOrder.id);
    res.status(201).json(fullOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const ordersData = await Order.findByUserId(req.user.id, { page, limit });
    res.json(ordersData);
});

// @desc    Get orders for a seller (or specific seller if admin)
// @route   GET /api/orders/seller-orders
// @route   GET /api/orders/seller-orders/:sellerId (Admin only)
// @access  Private (Seller or Admin)
const getSellerOrders = asyncHandler(async (req, res) => {
    let sellerIdToQuery;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (req.user.role === 'admin') {
        if (req.params.sellerId) {
            sellerIdToQuery = req.params.sellerId;
        } else if (req.query.sellerId) {
            sellerIdToQuery = req.query.sellerId;
        } else {
            // If admin is accessing /seller-orders without any ID, it might mean they want to see *all* seller orders
            // or it's an error. For this implementation, we'll assume it's an error if no ID specified.
            // Or, if the intent is to list all sellers' orders, that would be a different endpoint/logic.
            // For now, let's assume admin must specify if not their own (which is not applicable here).
            // If an admin wants to see *their own* orders (if they are also a seller), they would use a different flow or this needs clarification.
            // The original intent seems to be: admin can query specific sellerId or sellers query their own.
            res.status(400);
            throw new Error('Admin must specify a seller ID via route parameter or query string to view specific seller orders.');
        }
    } else if (req.user.role === 'seller') {
        sellerIdToQuery = req.user.id.toString(); 
        // Seller accessing /seller-orders/:someId or /seller-orders?sellerId=someId
        if ((req.params.sellerId && req.params.sellerId !== sellerIdToQuery) || 
            (req.query.sellerId && req.query.sellerId !== sellerIdToQuery)) {
            res.status(403);
            throw new Error('Sellers can only access their own orders.');
        }
        // If seller accesses /seller-orders (no params/query), it defaults to their own ID.
    } else {
        res.status(403);
        throw new Error('User not authorized to access seller orders.');
        return; 
    }

    // Assuming Order.findOrdersBySellerId is implemented in the Order model
    // This method should fetch orders where the sellerIdToQuery is involved.
    const ordersData = await Order.findOrdersBySellerId(sellerIdToQuery, { page, limit });
    res.json(ordersData);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findByIdWithItems(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    const isBuyer = req.user.id.toString() === order.userId.toString();
    // Check if any item in the order belongs to the current seller user
    const isSellerInvolved = order.items && order.items.some(item => item.sellerId.toString() === req.user.id.toString());

    if (req.user.role === 'admin' || isBuyer || (req.user.role === 'seller' && isSellerInvolved)) {
        res.json(order);
    } else {
        res.status(403);
        throw new Error('User not authorized to view this order');
    }
});

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Seller involved or Admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const orderId = req.params.id;

    if (!status) {
        res.status(400);
        throw new Error('Status is required for update.');
    }

    const order = await Order.findByIdWithItems(orderId); // Fetch with items for auth check

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    const isSellerInvolved = order.items && order.items.some(item => item.sellerId.toString() === req.user.id.toString());

    if (req.user.role === 'admin' || (req.user.role === 'seller' && isSellerInvolved)) {
        // Business logic for status transitions (example)
        if (req.user.role === 'seller') {
            const allowedSellerTransitions = {
                'pending': ['processing', 'cancelled'],
                'processing': ['shipped', 'cancelled'],
                // Sellers might not be able to mark as 'delivered' - this might be system/buyer confirmation
            };
            if (order.status === 'shipped' || order.status === 'delivered' || order.status === 'cancelled') {
                 res.status(403);
                 throw new Error(`Sellers cannot change status of '${order.status}' orders.`);
            }
            if (!allowedSellerTransitions[order.status] || !allowedSellerTransitions[order.status].includes(status.toLowerCase())){
                res.status(400);
                throw new Error(`Sellers cannot transition order from '${order.status}' to '${status}'.`);
            }
        }
        // Admins might have fewer restrictions

        const updatedOrder = await Order.updateStatus(orderId, status);
        res.json(updatedOrder);
    } else {
        res.status(403);
        throw new Error('User not authorized to update this order status');
    }
});

module.exports = {
    createOrder,
    getUserOrders,
    getSellerOrders,
    getOrderById,
    updateOrderStatus,
};
