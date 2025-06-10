const Order = require('../models/Order');
const Product = require('../models/Product');
const OrderItem = require('../models/OrderItem'); // Used for fetching details, creation might be within Order.create

// Buyer: Create a new order
exports.createOrder = async (req, res) => {
  const userId = req.user.id;
  const { items, shippingAddress, paymentDetails } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Order must contain at least one item' });
  }
  if (!shippingAddress || !paymentDetails) {
    return res.status(400).json({ message: 'Shipping address and payment details are required' });
  }

  try {
    // Pre-validation: Check product availability and approval status
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }
      if (!product.approved) {
        return res.status(400).json({ message: `Product ${product.name} is not approved for sale` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}. Available: ${product.stock}` });
      }
      totalAmount += product.price * item.quantity;
      orderItemsData.push({
        productId: product.id,
        sellerId: product.sellerId,
        quantity: item.quantity,
        priceAtPurchase: product.price
      });
    }

    // The Order.create method is expected to handle creating OrderItems and updating product stock in a transaction
    const orderData = {
      userId,
      items: orderItemsData, // Pass processed items data to the model
      totalAmount,
      shippingAddress: JSON.stringify(shippingAddress),
      paymentDetails: JSON.stringify(paymentDetails),
      orderStatus: 'Pending' // Initial status
    };

    const newOrder = await Order.create(orderData);
    res.status(201).json(newOrder);

  } catch (error) {
    console.error('Error creating order:', error);
    // Check if it's a custom error from Order.create (e.g., stock issue during transaction)
    if (error.message.includes('Stock issue') || error.message.includes('Product not found during order creation')) {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// Buyer: Get their orders with pagination
exports.getUserOrders = async (req, res) => {
  const userId = req.user.id;
  const { page, limit } = req.query;
  const options = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10
  };

  try {
    const orders = await Order.findByUserId(userId, options);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
};

// Buyer/Seller/Admin: Get a specific order by ID
exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const order = await Order.findById(id); // Order.findById should also fetch items
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Authorization: Buyer owns order, or Seller has an item in the order, or Admin
    const isOwner = order.userId === userId;
    const isSellerInOrder = userRole === 'seller' && order.items && order.items.some(item => item.sellerId === userId);
    
    if (!isOwner && !isSellerInOrder && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

// Seller/Admin: Get orders containing products sold by a seller
exports.getSellerOrders = async (req, res) => {
  let sellerIdToQuery = req.user.id; // Default to logged-in seller
  const userRole = req.user.role;
  const { page, limit, status } = req.query;
  
  // Admin can query for a specific sellerId
  if (userRole === 'admin' && req.query.sellerId) {
    sellerIdToQuery = parseInt(req.query.sellerId, 10);
  }

  const options = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    ...(status && { status })
  };

  try {
    // Order.findBySellerId should find orders containing items from this seller
    const orders = await Order.findBySellerId(sellerIdToQuery, options);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: 'Failed to fetch seller orders' });
  }
};

// Seller/Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params; // Order ID
  const { status } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Confirmed'];
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid or missing status. Allowed: ' + allowedStatuses.join(', ') });
  }

  try {
    const order = await Order.findById(id); // Fetch order to check authorization
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Authorization: Seller has an item in the order, or Admin
    const isSellerInOrder = userRole === 'seller' && order.items && order.items.some(item => item.sellerId === userId);
    if (userRole !== 'admin' && !isSellerInOrder) {
      return res.status(403).json({ message: 'Not authorized to update this order status' });
    }
    
    // For sellers, they should only update status of orders containing their items.
    // The Order.updateStatus model method might need to handle partial updates or this controller should enforce it.
    // For simplicity here, we assume if a seller has any item, they can update the overall order status if the platform logic allows.
    // A more granular approach might be item-level statuses or seller-specific order views.

    const updatedOrder = await Order.updateStatus(id, status);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(`Error updating order status for ${id}:`, error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};
