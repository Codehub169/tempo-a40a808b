import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Button, Image, Grid, Icon, Select, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Tabs, TabList, TabPanels, Tab, TabPanel, List, ListItem, ListIcon, Input, Divider, Tag, Link as ChakraLink, useToast } from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { FiShoppingCart, FiCreditCard, FiChevronRight, FiCheckCircle, FiStar } from 'react-icons/fi';

// Placeholder product data - replace with API call
const productsData = {
  '1': {
    id: '1',
    name: 'Refurbished iPhone 12 (128GB, Blue)',
    category: 'Mobiles',
    seller: 'GadgetRenew Co.',
    condition: 'Excellent',
    price: '₹45,000',
    originalPrice: 'MRP: ₹60,000',
    description: 'This iPhone 12 has been professionally refurbished, tested, and cleaned by qualified sellers. Product is in Excellent condition with minimal to no signs of wear. It comes with a compatible charger and a 6-month seller warranty.',
    images: [
      'https://placehold.co/600x400/E9ECEF/343A40?text=iPhone+12+Main',
      'https://placehold.co/600x400/E9ECEF/343A40?text=iPhone+Angle+1',
      'https://placehold.co/600x400/E9ECEF/343A40?text=iPhone+Back',
      'https://placehold.co/600x400/E9ECEF/343A40?text=iPhone+Screen+On',
      'https://placehold.co/600x400/E9ECEF/343A40?text=iPhone+Box',
    ],
    details: {
      warranty: '6 Months Seller Warranty',
      returns: '7 Days Easy Returns',
      delivery: 'Estimated 3-5 business days',
    },
    specs: [
      { label: 'Display', value: '6.1-inch Super Retina XDR display' },
      { label: 'Chip', value: 'A14 Bionic chip' },
      { label: 'Storage', value: '128GB' },
      { label: 'Rear Camera', value: 'Dual 12MP (Ultra Wide, Wide)' },
      { label: 'Front Camera', value: '12MP TrueDepth camera' },
    ],
    refurbishmentProcess: {
        seller: 'GadgetRenew Co.',
        points: [
            'Thorough Inspection: Each device undergoes a comprehensive 70+ point quality check.',
            'Data Sanitization: All previous user data is securely wiped.',
            'Component Replacement: Faulty components replaced with high-quality parts. Battery health > 85%.',
            'Cleaning & Polishing: Professionally cleaned and sanitized.',
            'Final Quality Assurance: Rigorous final testing.'
        ],
        conditionNote: 'This "Excellent" condition device will show very minimal to no signs of cosmetic wear.'
    },
    sellerReviews: [
        { user: 'Aarav P.', rating: 5, comment: 'Product was exactly as described. Excellent condition, like new!', date: '2 weeks ago' },
        { user: 'Priya S.', rating: 4, comment: 'Good phone, works perfectly. Minor scratch on the back but it was mentioned.', date: '1 month ago' },
    ]
  },
  // Add more products as needed
};

const ProductDetailPage = () => {
  const { productId } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();

  useEffect(() => {
    // Simulate API call to fetch product details
    const fetchedProduct = productsData[productId];
    if (fetchedProduct) {
      setProduct(fetchedProduct);
      setSelectedImage(fetchedProduct.images[0]);
    } else {
      // Handle product not found, e.g., redirect or show error
      console.error("Product not found");
    }
  }, [productId]);

  const handleThumbnailClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic (e.g., update context/local storage, API call)
    toast({
        title: `${product.name} added to cart.`,
        description: `Quantity: ${quantity}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    // For now, just log
    console.log(`Added ${quantity} of ${product.name} to cart.`);
  };

  if (!product) {
    return <Text p={10} textAlign="center">Loading product details or product not found...</Text>;
  }

  return (
    <Box maxW="container.xl" mx="auto" px={4} py={{ base: 6, lg: 12 }}>
      <Breadcrumb spacing="8px" separator={<FiChevronRight color="gray.500" />} mb={6}>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to={`/products?category=${product.category.toLowerCase()}`}>{product.category}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#" isTruncated maxW="200px">{product.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Box bg="white" p={{ base: 4, md: 6, lg: 10 }} borderRadius="lg" boxShadow="xl">
        <Grid templateColumns={{ base: "1fr", lg: "2fr 3fr" }} gap={{ base: 6, lg: 12 }}>
          {/* Product Gallery */}
          <Box>
            <Image 
              id="main-product-image" 
              src={selectedImage} 
              alt={product.name} 
              w="full" 
              borderRadius="lg" 
              boxShadow="md" 
              objectFit="cover" 
              mb={4}
              aspectRatio={{base: "4/3", sm: "1/1"}}
            />
            <Grid templateColumns="repeat(5, 1fr)" gap={2}>
              {product.images.map((imgSrc, index) => (
                <Image 
                  key={index} 
                  src={imgSrc} 
                  alt={`Thumbnail ${index + 1}`} 
                  cursor="pointer" 
                  borderRadius="md" 
                  borderWidth={selectedImage === imgSrc ? "2px" : "1px"} 
                  borderColor={selectedImage === imgSrc ? "brand.primary" : "gray.200"} 
                  _hover={{ borderColor: "brand.primary" }}
                  onClick={() => handleThumbnailClick(imgSrc)}
                  objectFit="cover"
                  aspectRatio="1/1"
                />
              ))}
            </Grid>
          </Box>

          {/* Product Info */}
          <Box>
            <Heading as="h1" size={{base: "lg", md: "xl"}} fontWeight="bold" mb={2}>{product.name}</Heading>
            <Flex align="center" mb={3}>
              <Text fontSize="sm" color="gray.500" mr={2}>Sold by:</Text>
              <ChakraLink as={RouterLink} to={`/sellers/${product.seller.replace(/\s+/g, '-').toLowerCase()}`} color="brand.primary" fontWeight="semibold" _hover={{ textDecoration: 'underline' }}>
                {product.seller}
              </ChakraLink>
            </Flex>
            <Tag size="md" variant="subtle" colorScheme="yellow" mb={4}>{product.condition} Condition</Tag>
            
            <Text fontSize={{base: "2xl", md: "3xl"}} fontWeight="bold" color="brand.primary" mb={1}>{product.price}</Text>
            <Text color="gray.500" textDecoration="line-through" mb={4}>{product.originalPrice}</Text>

            <Text color="gray.700" mb={6} lineHeight="relaxed">{product.description}</Text>

            <Flex align="center" gap={3} mb={6}>
              <Text fontSize="sm" fontWeight="medium">Quantity:</Text>
              <Input 
                type="number" 
                id="quantity" 
                name="quantity" 
                value={quantity} 
                min={1} 
                onChange={handleQuantityChange} 
                w="70px" 
                textAlign="center" 
                borderColor="gray.300" 
                _hover={{borderColor: "gray.400"}}
                focusBorderColor="brand.primary"
              />
            </Flex>

            <Stack direction={{base: "column", sm: "row"}} spacing={3} mb={6}>
                <Button 
                    colorScheme="green" 
                    size="lg" 
                    leftIcon={<FiShoppingCart />} 
                    onClick={handleAddToCart}
                    flex={1}
                    _hover={{transform: "scale(1.02)"}}
                >
                    Add to Cart
                </Button>
                <Button 
                    as={RouterLink} 
                    to="/checkout" 
                    colorScheme="blue" 
                    size="lg" 
                    leftIcon={<FiCreditCard />} 
                    flex={1}
                    _hover={{transform: "scale(1.02)"}}
                >
                    Buy Now
                </Button>
            </Stack>
            
            <Box fontSize="sm" color="gray.600" >
              <Text><Text as="span" fontWeight="semibold">Warranty:</Text> {product.details.warranty}</Text>
              <Text><Text as="span" fontWeight="semibold">Returns:</Text> {product.details.returns}</Text>
              <Text><Text as="span" fontWeight="semibold">Delivery:</Text> {product.details.delivery}</Text>
            </Box>
          </Box>
        </Grid>

        {/* Product Details Tabs */}
        <Tabs variant="line" colorScheme="blue" mt={{ base: 10, lg: 16 }}>
          <TabList overflowX="auto" sx={{ '&::-webkit-scrollbar': { display: 'none'}, '-ms-overflow-style': 'none', 'scrollbar-width': 'none'}}>
            <Tab fontWeight="medium">Description</Tab>
            <Tab fontWeight="medium">Specifications</Tab>
            <Tab fontWeight="medium">Refurbishment Process</Tab>
            <Tab fontWeight="medium">Seller Reviews ({product.sellerReviews.length})</Tab>
          </TabList>
          <TabPanels pt={6}>
            <TabPanel>
              <Heading size="md" mb={3}>Product Overview</Heading>
              <Text mb={3}>{product.description}</Text>
              {/* Add more detailed description if available */}
            </TabPanel>
            <TabPanel>
              <Heading size="md" mb={3}>Technical Specifications</Heading>
              <List spacing={2}>
                {product.specs.map((spec, index) => (
                  <ListItem key={index} display="flex">
                    <Text fontWeight="semibold" w="150px" mr={2}>{spec.label}:</Text>
                    <Text>{spec.value}</Text>
                  </ListItem>
                ))}
              </List>
            </TabPanel>
            <TabPanel>
                <Heading size="md" mb={3}>Refurbishment Process (by {product.refurbishmentProcess.seller})</Heading>
                <Text mb={3}>At {product.refurbishmentProcess.seller}, we take pride in our meticulous refurbishment process:</Text>
                <List spacing={2} styleType="decimal" stylePosition="inside" mb={3}>
                    {product.refurbishmentProcess.points.map((point, index) => (
                        <ListItem key={index}>{point}</ListItem>
                    ))}
                </List>
                <Text fontStyle="italic">{product.refurbishmentProcess.conditionNote}</Text>
            </TabPanel>
            <TabPanel>
                <Heading size="md" mb={4}>Seller Reviews for {product.seller} ({product.sellerReviews.reduce((acc, review) => acc + review.rating, 0) / product.sellerReviews.length || 0}/5 stars)</Heading>
                <Stack spacing={6}>
                    {product.sellerReviews.map((review, index) => (
                        <Box key={index} borderBottomWidth={index < product.sellerReviews.length -1 ? "1px" : "0px"} pb={index < product.sellerReviews.length -1 ? 4 : 0}>
                            <Flex align="center" mb={1}>
                                <Text fontWeight="semibold" mr={2}>{review.user}</Text>
                                <Flex>
                                    {[...Array(5)].map((_, i) => (
                                        <Icon key={i} as={FiStar} color={i < review.rating ? "yellow.400" : "gray.300"} />
                                    ))}
                                </Flex>
                            </Flex>
                            <Text fontSize="xs" color="gray.500" mb={1}>Verified Purchase | {review.date}</Text>
                            <Text>{review.comment}</Text>
                        </Box>
                    ))}
                    {product.sellerReviews.length === 0 && <Text>No reviews yet for this seller.</Text>}
                    <ChakraLink color="brand.primary" fontWeight="medium" mt={2} _hover={{textDecoration: 'underline'}}>
                        View all reviews for this seller
                    </ChakraLink>
                </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default ProductDetailPage;
