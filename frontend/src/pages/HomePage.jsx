import React from 'react';
import { Box, Flex, Heading, Text, Button, Image, Grid, Icon, Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiShoppingCart, FiCheckCircle, FiDollarSign, FiZap } from 'react-icons/fi';
import ProductCard from '../components/ProductCard'; // Assuming ProductCard is now a shared component

const HomePage = () => {
  // Placeholder data, to be replaced by API calls
  const categories = [
    { name: 'Mobiles', image: 'https://placehold.co/100x100/007BFF/FFFFFF?text=Mobile', link: '/products?category=mobiles' },
    { name: 'Laptops', image: 'https://placehold.co/100x100/28A745/FFFFFF?text=Laptop', link: '/products?category=laptops' },
    { name: 'Televisions', image: 'https://placehold.co/100x100/FFC107/343A40?text=TV', link: '/products?category=tv' },
    { name: 'Appliances', image: 'https://placehold.co/100x100/DC3545/FFFFFF?text=Fridge', link: '/products?category=appliances' },
  ];

  const featuredProducts = [
    { id: '1', name: 'Refurbished iPhone 12', images: ['https://placehold.co/300x200/E9ECEF/343A40?text=Refurb+iPhone+12'], condition: 'Excellent', price: '45000', originalPrice: '60000', sellerName: 'ReTech Certified' },
    { id: '2', name: 'Refurbished Dell Laptop i5', images: ['https://placehold.co/300x200/E9ECEF/343A40?text=Dell+Laptop+i5'], condition: 'Good', price: '28000', originalPrice: '40000', sellerName: 'Laptop Experts' },
    { id: '3', name: 'Refurbished Samsung 4K TV', images: ['https://placehold.co/300x200/E9ECEF/343A40?text=Samsung+4K+TV'], condition: 'Like New', price: '32000', originalPrice: '55000', sellerName: 'TV Hub' },
    { id: '4', name: 'Refurbished LG Washing Machine', images: ['https://placehold.co/300x200/E9ECEF/343A40?text=LG+Washing+Machine'], condition: 'Good', price: '15000', originalPrice: '22000', sellerName: 'Appliance Masters' }, // Changed condition from 'Very Good' to 'Good' to match ProductCard options
  ];

  const whyChooseUsItems = [
    { icon: FiCheckCircle, title: 'Quality Assured', description: 'Every product is rigorously tested and certified by experts. Shop with confidence.' },
    { icon: FiDollarSign, title: 'Unbeatable Value', description: 'Get your favorite gadgets at significantly lower prices without compromising on quality.' },
    { icon: FiZap, title: 'Eco-Friendly', description: 'Contribute to a sustainable future by giving electronics a second life.' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box bg="brand.primary" color="white" py={{ base: 20, lg: 32 }}>
        <Box maxW="container.xl" mx="auto" px={4} textAlign="center">
          <Heading as="h1" size={{ base: "2xl", lg: "4xl" }} fontWeight="bold" mb={6}>
            Trusted Refurbished Electronics
          </Heading>
          <Text fontSize={{ base: "lg", lg: "2xl" }} mb={10} maxW="3xl" mx="auto">
            Buy quality-checked gadgets at unbeatable prices. Sell your refurbished items to a ready market. Join the circular economy!
          </Text>
          <Flex direction={{ base: "column", sm: "row" }} justify="center" align="center" gap={4}>
            <Button as={RouterLink} to="/products" size="lg" colorScheme="green" _hover={{ transform: "scale(1.05)" }} px={8} py={6} fontSize="lg">
              Shop Now
            </Button>
            <Button as={RouterLink} to="/seller/dashboard" size="lg" bg="white" color="brand.primary" _hover={{ bg: "gray.100", transform: "scale(1.05)" }} px={8} py={6} fontSize="lg">
              Become a Seller
            </Button>
          </Flex>
        </Box>
      </Box>

      {/* Featured Categories */}
      <Box py={16} bg="brand.secondary"> {/* Updated from brand.secondaryBg */}
        <Box maxW="container.xl" mx="auto" px={4}>
          <Heading as="h2" size="xl" fontWeight="semibold" textAlign="center" mb={12}>
            Shop by Category
          </Heading>
          <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={{ base: 6, lg: 8 }}>
            {categories.map((category) => (
              <ChakraLink as={RouterLink} to={category.link} key={category.name} _hover={{ textDecoration: 'none' }} display="block">
                <Box 
                  textAlign="center" 
                  p={6} 
                  bg="white" 
                  borderRadius="lg" 
                  boxShadow="lg" 
                  transition="all 0.3s ease-in-out" 
                  _hover={{ boxShadow: "xl", transform: "translateY(-5px)" }}
                  h="100%"
                >
                  <Image src={category.image} alt={category.name} mx="auto" h={20} w={20} mb={4} transition="transform 0.3s ease-in-out" _groupHover={{ transform: "scale(1.1)" }}/>
                  <Heading as="h3" size="md" fontWeight="semibold" mb={1}>{category.name}</Heading>
                  <Text fontSize="sm" color="gray.600">{category.description || `Latest & classic models`}</Text>
                </Box>
              </ChakraLink>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Featured Products */}
      <Box py={16}>
        <Box maxW="container.xl" mx="auto" px={4}>
          <Heading as="h2" size="xl" fontWeight="semibold" textAlign="center" mb={12}>
            Hot Deals
          </Heading>
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={{ base: 6, lg: 8 }}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Why Choose Us Section */}
      <Box py={16} bg="brand.secondary"> {/* Also updated this for consistency, assuming brand.secondaryBg was a typo */}
        <Box maxW="container.xl" mx="auto" px={4}>
          <Heading as="h2" size="xl" fontWeight="semibold" textAlign="center" mb={12}>
            Why Re<Text as="span" color="brand.accent">Tech</Text>?
          </Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8} textAlign="center">
            {whyChooseUsItems.map((item) => (
              <Box key={item.title} p={6}>
                <Flex 
                  bg="brand.accent" 
                  color="white" 
                  borderRadius="full" 
                  h={16} w={16} 
                  align="center" 
                  justify="center" 
                  mx="auto" 
                  mb={4}
                >
                  <Icon as={item.icon} boxSize={8} />
                </Flex>
                <Heading as="h3" size="lg" fontWeight="semibold" mb={2}>{item.title}</Heading>
                <Text color="gray.600">{item.description}</Text>
              </Box>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
