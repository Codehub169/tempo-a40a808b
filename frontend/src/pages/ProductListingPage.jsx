import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Button, Image, Grid, Icon, Select, Checkbox, CheckboxGroup, Stack, Input, Radio, RadioGroup, Link as ChakraLink, useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, IconButton } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiFilter } from 'react-icons/fi';

// Placeholder Product Card component for PLP (similar to HomePage)
const ProductCard = ({ product }) => (
  <Box borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="md" _hover={{ boxShadow: "xl" }} transition="box-shadow 0.3s ease-in-out" bg="white">
    <RouterLink to={`/products/${product.id}`}>
      <Image src={product.image} alt={product.name} h="48" w="full" objectFit="cover" />
    </RouterLink>
    <Box p={4}>
      <Heading as="h3" size="sm" fontWeight="semibold" mb={1} minH={{base: "auto", md: "2.5em"}} noOfLines={2} _hover={{ color: "brand.primary" }} transition="color 0.2s ease-in-out">
        <RouterLink to={`/products/${product.id}`}>{product.name}</RouterLink>
      </Heading>
      <Text fontSize="xs" color="gray.500" mb={1}>Condition: {product.condition}</Text>
      <Text fontSize="xs" color="gray.500" mb={2}>Seller: {product.seller}</Text>
      <Flex align="baseline" mb={2}>
        <Text fontSize="lg" fontWeight="bold" color="brand.primary">{product.price}</Text>
        {product.originalPrice && (
          <Text as="span" ml="2" fontSize="xs" color="gray.500" textDecoration="line-through">
            {product.originalPrice}
          </Text>
        )}
      </Flex>
      <Button as={RouterLink} to="/cart" colorScheme="green" variant="solid" w="full" size="sm" leftIcon={<FiShoppingCart />}>
        Add to Cart
      </Button>
    </Box>
  </Box>
);

const ProductListingPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState([]);
  const [conditionFilter, setConditionFilter] = useState('');
  const [sellerFilter, setSellerFilter] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('relevance');
  const { isOpen, onOpen, onClose } = useDisclosure(); // For mobile filter drawer

  // Placeholder data
  const allProducts = [
    { id: '1', name: 'Refurbished Samsung Galaxy Book Pro', image: 'https://placehold.co/300x200/E9ECEF/343A40?text=Samsung+Galaxy+Book', condition: 'Good', seller: 'TechSavers Inc.', price: '₹55,000', originalPrice: '₹75,000', category: 'laptops', brand: 'samsung' },
    { id: '2', name: 'Refurbished Samsung Chromebook 4', image: 'https://placehold.co/300x200/E9ECEF/343A40?text=Samsung+Chromebook', condition: 'Good', seller: 'GadgetRenew Co.', price: '₹18,500', originalPrice: '₹25,000', category: 'laptops', brand: 'samsung' },
    { id: '3', name: 'Refurbished Samsung Notebook Plus', image: 'https://placehold.co/300x200/E9ECEF/343A40?text=Samsung+Notebook', condition: 'Good', seller: 'TechSavers Inc.', price: '₹32,000', originalPrice: '₹45,000', category: 'laptops', brand: 'samsung' },
    { id: '4', name: 'Refurbished iPhone 13', image: 'https://placehold.co/300x200/007BFF/FFFFFF?text=iPhone+13', condition: 'Excellent', seller: 'AppleCertified', price: '₹65,000', originalPrice: '₹79,000', category: 'mobiles', brand: 'apple' },
    { id: '5', name: 'Refurbished Dell XPS 15', image: 'https://placehold.co/300x200/FFC107/343A40?text=Dell+XPS', condition: 'Like New', seller: 'DellRefurbs', price: '₹85,000', originalPrice: '₹120,000', category: 'laptops', brand: 'dell' },
    { id: '6', name: 'Refurbished Sony Bravia 55" TV', image: 'https://placehold.co/300x200/DC3545/FFFFFF?text=Sony+TV', condition: 'Very Good', seller: 'GadgetRenew Co.', price: '₹42,000', originalPrice: '₹60,000', category: 'tv', brand: 'sony' },
  ];

  useEffect(() => {
    // Simulate API call
    setProducts(allProducts);
    // Apply initial category filter from URL query params
    const queryParams = new URLSearchParams(location.search);
    const categoryFromQuery = queryParams.get('category');
    if (categoryFromQuery) {
      setCategoryFilter(categoryFromQuery);
    }
  }, [location.search]);

  useEffect(() => {
    let tempProducts = [...products];
    if (categoryFilter) {
      tempProducts = tempProducts.filter(p => p.category === categoryFilter);
    }
    if (brandFilter.length > 0) {
      tempProducts = tempProducts.filter(p => brandFilter.includes(p.brand));
    }
    if (conditionFilter) {
      tempProducts = tempProducts.filter(p => p.condition.toLowerCase().replace(' ', '') === conditionFilter);
    }
    if (sellerFilter.length > 0) {
        tempProducts = tempProducts.filter(p => sellerFilter.includes(p.seller.toLowerCase().replace(/\s+/g, '')));
    }
    if (priceRange.min) {
      tempProducts = tempProducts.filter(p => parseFloat(p.price.replace('₹', '').replace(',', '')) >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      tempProducts = tempProducts.filter(p => parseFloat(p.price.replace('₹', '').replace(',', '')) <= parseFloat(priceRange.max));
    }

    // Sorting logic
    if (sortBy === 'price-asc') {
      tempProducts.sort((a, b) => parseFloat(a.price.replace('₹', '').replace(',', '')) - parseFloat(b.price.replace('₹', '').replace(',', '')));
    } else if (sortBy === 'price-desc') {
      tempProducts.sort((a, b) => parseFloat(b.price.replace('₹', '').replace(',', '')) - parseFloat(a.price.replace('₹', '').replace(',', '')));
    } // Add more sorting options like 'newest' if needed

    setFilteredProducts(tempProducts);
  }, [products, categoryFilter, brandFilter, conditionFilter, sellerFilter, priceRange, sortBy]);

  const handleApplyFilters = () => {
    // This function can be used if we want an explicit apply button.
    // For now, filters apply on change.
    if(isOpen) onClose(); // Close drawer on mobile if filters applied
  };

  const FilterSidebarContent = () => (
    <Box>
      <Heading size="md" mb={6}>Filters</Heading>
      {/* Category Filter */}
      <Box mb={6}>
        <Text fontWeight="semibold" mb={2}>Category</Text>
        <RadioGroup onChange={setCategoryFilter} value={categoryFilter}>
          <Stack spacing={2}>
            <Radio value="">All</Radio>
            <Radio value="mobiles">Mobiles</Radio>
            <Radio value="laptops">Laptops</Radio>
            <Radio value="tv">Televisions</Radio>
            <Radio value="appliances">Appliances</Radio>
          </Stack>
        </RadioGroup>
      </Box>

      {/* Brand Filter */}
      <Box mb={6}>
        <Text fontWeight="semibold" mb={2}>Brand</Text>
        <CheckboxGroup colorScheme='blue' onChange={setBrandFilter} value={brandFilter}>
          <Stack spacing={2}>
            <Checkbox value="apple">Apple</Checkbox>
            <Checkbox value="samsung">Samsung</Checkbox>
            <Checkbox value="dell">Dell</Checkbox>
            <Checkbox value="lg">LG</Checkbox>
            <Checkbox value="sony">Sony</Checkbox>
          </Stack>
        </CheckboxGroup>
      </Box>

      {/* Price Range Filter */}
      <Box mb={6}>
        <Text fontWeight="semibold" mb={2}>Price Range</Text>
        <Flex align="center" gap={2}>
          <Input placeholder="Min" type="number" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: e.target.value})} />
          <Text>-</Text>
          <Input placeholder="Max" type="number" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: e.target.value})} />
        </Flex>
      </Box>

      {/* Condition Filter */}
      <Box mb={6}>
        <Text fontWeight="semibold" mb={2}>Condition</Text>
        <RadioGroup onChange={setConditionFilter} value={conditionFilter}>
          <Stack spacing={2}>
            <Radio value="">Any</Radio>
            <Radio value="likenew">Like New</Radio>
            <Radio value="excellent">Excellent</Radio>
            <Radio value="verygood">Very Good</Radio>
            <Radio value="good">Good</Radio>
            <Radio value="fair">Fair</Radio>
          </Stack>
        </RadioGroup>
      </Box>

      {/* Seller Filter */}
        <Box mb={6}>
            <Text fontWeight="semibold" mb={2}>Seller</Text>
            <CheckboxGroup colorScheme='blue' onChange={setSellerFilter} value={sellerFilter}>
            <Stack spacing={2}>
                <Checkbox value="techsaversinc.">TechSavers Inc.</Checkbox>
                <Checkbox value="gadgetrenewco.">GadgetRenew Co.</Checkbox>
                <Checkbox value="applecertified">AppleCertified</Checkbox>
                <Checkbox value="dellrefurbs">DellRefurbs</Checkbox>
            </Stack>
            </CheckboxGroup>
        </Box>

      <Button colorScheme="blue" w="full" onClick={handleApplyFilters} mt={4}>Apply Filters</Button>
    </Box>
  );

  return (
    <Box maxW="container.xl" mx="auto" px={4} py={{ base: 6, lg: 12 }}>
      <Flex direction={{ base: "column", lg: "row" }} gap={8}>
        {/* Filters Sidebar - Desktop */}
        <Box 
          w={{ base: "full", lg: "1/4" }} 
          bg="white" 
          p={6} 
          borderRadius="lg" 
          boxShadow="lg" 
          alignSelf="start" 
          sticky={{lg: "top"}} 
          top={{lg: "calc(var(--navbar-height, 60px) + 24px)"}} // Adjust based on actual Navbar height
          maxH={{lg: "calc(100vh - var(--navbar-height, 60px) - 48px)"}} 
          overflowY={{lg: "auto"}}
          display={{base: "none", lg: "block"}}
        >
          <FilterSidebarContent />
        </Box>

        {/* Product Grid */}
        <Box w={{ base: "full", lg: "3/4" }}>
          <Flex justify="space-between" align="center" mb={6} bg="white" p={4} borderRadius="lg" boxShadow="md" direction={{base: "column", sm: "row"}} gap={2}>
            <Heading as="h1" size={{base: "md", sm:"lg"}} fontWeight="semibold" flexShrink={0}>
              {categoryFilter ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Products` : 'All Products'}
              <Text as="span" fontSize="sm" color="gray.500" ml={2}>({filteredProducts.length} items)</Text>
            </Heading>
            <Flex align="center" gap={2} w={{base: "full", sm: "auto"}} justify={{base: "space-between", sm: "flex-end"}}>
                <IconButton 
                    aria-label="Open Filters" 
                    icon={<FiFilter />} 
                    onClick={onOpen} 
                    display={{ base: "inline-flex", lg: "none" }}
                    size="md"
                />
                <Select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)} 
                    w={{base: "auto", sm: "200px"}} 
                    size="md"
                    focusBorderColor="brand.primary"
                >
                    <option value="relevance">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                </Select>
            </Flex>
          </Flex>

          {filteredProducts.length > 0 ? (
            <Grid templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap={6}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Grid>
          ) : (
            <Text textAlign="center" py={10} fontSize="lg">No products found matching your criteria.</Text>
          )}

          {/* Pagination (Placeholder) */}
          <Flex justify="center" align="center" mt={10} gap={2}>
            <Button as={ChakraLink} href="#" variant="outline" size="sm">Previous</Button>
            <Button as={ChakraLink} href="#" colorScheme="blue" variant="solid" size="sm">1</Button>
            <Button as={ChakraLink} href="#" variant="outline" size="sm">2</Button>
            <Button as={ChakraLink} href="#" variant="outline" size="sm">3</Button>
            <Text>...</Text>
            <Button as={ChakraLink} href="#" variant="outline" size="sm">10</Button>
            <Button as={ChakraLink} href="#" variant="outline" size="sm">Next</Button>
          </Flex>
        </Box>
      </Flex>
      
      {/* Filters Drawer - Mobile */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Filters</DrawerHeader>
          <DrawerBody>
            <FilterSidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

    </Box>
  );
};

export default ProductListingPage;
