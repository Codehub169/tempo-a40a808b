const Product = require('../models/Product');

// Seller: Create a new product (initially unapproved)
exports.createProduct = async (req, res) => {
  const { name, description, price, category, brand, condition, stock, images, specifications, tags } = req.body;
  const sellerId = req.user.id; // From authMiddleware

  if (!name || !price || !category || !condition || !stock) {
    return res.status(400).json({ message: 'Name, price, category, condition, and stock are required' });
  }

  try {
    const productData = {
      name,
      description: description || '',
      price: parseFloat(price),
      category,
      brand: brand || '',
      condition,
      stock: parseInt(stock, 10),
      images: JSON.stringify(images || []),
      sellerId,
      specifications: JSON.stringify(specifications || {}),
      tags: JSON.stringify(tags || []),
      approved: 0 // Products are initially unapproved
    };

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// Public: Get all approved products with filtering, sorting, pagination
exports.getAllProducts = async (req, res) => {
  const { category, brand, condition, minPrice, maxPrice, searchTerm, sellerId, sortBy, page, limit } = req.query;
  const filters = {
    approved: 1,
    ...(category && { category }),
    ...(brand && { brand }),
    ...(condition && { condition }),
    ...(minPrice && { minPrice: parseFloat(minPrice) }),
    ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
    ...(searchTerm && { searchTerm }),
    ...(sellerId && { sellerId: parseInt(sellerId, 10) })
  };
  const options = {
    ...(sortBy && { sortBy }),
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10
  };

  try {
    const products = await Product.findAll(filters, options);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Public: Get a single approved product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product || !product.approved) {
      return res.status(404).json({ message: 'Product not found or not approved' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// Seller/Admin: Update a product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (userRole !== 'admin' && product.sellerId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    // If seller updates, product becomes unapproved
    if (userRole === 'seller' && product.sellerId === userId) {
      updates.approved = 0;
    } else if (userRole === 'admin' && updates.approved !== undefined) {
      updates.approved = parseInt(updates.approved, 10) === 1 ? 1 : 0;
    }
    
    // Ensure specific fields are parsed correctly if present in updates
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.stock) updates.stock = parseInt(updates.stock, 10);
    if (updates.images) updates.images = JSON.stringify(updates.images);
    if (updates.specifications) updates.specifications = JSON.stringify(updates.specifications);
    if (updates.tags) updates.tags = JSON.stringify(updates.tags);


    const updatedProduct = await Product.update(id, updates);
    if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found or update failed' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// Seller/Admin: Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (userRole !== 'admin' && product.sellerId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.delete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

// Admin: Get all products (including unapproved)
exports.adminGetAllProducts = async (req, res) => {
  const { category, brand, condition, minPrice, maxPrice, searchTerm, sellerId, approved, sortBy, page, limit } = req.query;
  const filters = {
    ...(category && { category }),
    ...(brand && { brand }),
    ...(condition && { condition }),
    ...(minPrice && { minPrice: parseFloat(minPrice) }),
    ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
    ...(searchTerm && { searchTerm }),
    ...(sellerId && { sellerId: parseInt(sellerId, 10) }),
    ...(approved !== undefined && { approved: parseInt(approved, 10) }), // Admin can filter by approved status
  };
  const options = {
    ...(sortBy && { sortBy }),
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10
  };

  try {
    const products = await Product.findAll(filters, options);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching all products (admin):', error);
    res.status(500).json({ message: 'Failed to fetch products for admin' });
  }
};

// Admin: Approve a product
exports.adminApproveProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const updatedProduct = await Product.update(id, { approved: 1 });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(`Error approving product ${id}:`, error);
    res.status(500).json({ message: 'Failed to approve product' });
  }
};
