import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Button, Image, Icon, Input, Divider, Link as ChakraLink, IconButton, Stack, Alert, AlertIcon, CloseButton, useToast } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi';

// Placeholder cart items data - replace with context or API call
const initialCartItems = [
  {
    id: '1',
    name: 'Refurbished iPhone 12 (128GB, Blue)',
    image: 'https://placehold.co/150x150/E9ECEF/343A40?text=iPhone+12',
    price: 45000,
    quantity: 1,
    condition: 'Excellent',
    seller: 'GadgetRenew Co.',
    link: '/products/1'
  },
  {
    id: '2',
    name: 'Refurbished Dell Laptop i5', 
    image: 'https://placehold.co/150x150/E9ECEF/343A40?text=Dell+Laptop',
    price: 28000,
    quantity: 1,
    condition: 'Good',
    seller: 'TechSavers Inc.',
    link: '/products/2'
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isCartEmpty, setIsCartEmpty] = useState(cartItems.length === 0);
  const toast = useToast();

  useEffect(() => {
    setIsCartEmpty(cartItems.length === 0);
  }, [cartItems]);

  const handleQuantityChange = (id, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (quantity >= 1) {
      setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity } : item));
    } else if (quantity === 0) {
        // Optionally, you can remove item if quantity is 0, or just keep it at 1.
        // For this example, let's keep it at 1 if they try to go below 1 via input.
        // If they want to remove, they should use the remove button.
        setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: 1 } : item));
    }
  };

  const handleRemoveItem = (id) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({
        title: `${itemToRemove.name} removed from cart.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const shippingCost = subtotal > 0 ? 99 : 0; // Example shipping cost
  const total = subtotal + shippingCost;

  if (isCartEmpty) {
    return (
      <Box maxW="container.md" mx="auto" px={4} py={{ base: 10, lg: 20 }} textAlign="center">
        <Icon as={FiShoppingCart} boxSize={20} color="gray.400" mb={6} />
        <Heading size="lg" mb={4}>Your Cart is Empty</Heading>
        <Text mb={6} color="gray.600">Looks like you haven't added anything to your cart yet.</Text>
        <Button as={RouterLink} to="/products" colorScheme="blue" size="lg">
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box maxW="container.xl" mx="auto" px={4} py={{ base: 6, lg: 12 }}>
      <Heading as="h1" size="xl" mb={8} textAlign={{base: "center", md: "left"}}>
        Shopping Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)
      </Heading>

      <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
        {/* Cart Items List */}
        <Box flex={2} bg="white" p={{base: 4, md:6}} borderRadius="lg" shadow="md">
          {cartItems.map((item) => (
            <React.Fragment key={item.id}>
              <Flex direction={{ base: 'column', sm: 'row' }} align={{base: 'flex-start', sm: 'center'}} justify="space-between" py={4}>
                <Flex align="center" mb={{base:4, sm:0}} flex={1}>
                  <Image src={item.image} alt={item.name} boxSize={{base: "80px", md: "100px"}} objectFit="cover" borderRadius="md" mr={{base:3, md:4}} />
                  <Box>
                    <ChakraLink as={RouterLink} to={item.link} fontWeight="semibold" fontSize={{base: "sm", md: "md"}} _hover={{color: "brand.primary"}} display="block" mb={1}>{item.name}</ChakraLink>
                    <Text fontSize="xs" color="gray.500">Condition: {item.condition}</Text>
                    <Text fontSize="xs" color="gray.500">Sold by: {item.seller}</Text>
                  </Box>
                </Flex>
                
                <Flex align="center" justify={{base: "space-between", sm: "flex-end"}} w={{base: "full", sm: "auto"}} mt={{base:2, sm:0}}>
                    <Input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)} 
                        min={1}
                        w={{base: "60px", md: "70px"}} 
                        textAlign="center" 
                        mr={{base:2, md:4}}
                        size={{base: "sm", md: "md"}}
                        borderColor="gray.300"
                        _hover={{borderColor: "gray.400"}}
                        focusBorderColor="brand.primary"
                    />
                    <Text fontWeight="semibold" w={{base: "80px", md: "100px"}} textAlign="right" mr={{base:2, md:4}} fontSize={{base: "sm", md: "md"}}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </Text>
                    <IconButton 
                        aria-label="Remove item" 
                        icon={<FiTrash2 />} 
                        onClick={() => handleRemoveItem(item.id)} 
                        variant="ghost" 
                        colorScheme="red" 
                        size={{base: "sm", md: "md"}}
                    />
                </Flex>
              </Flex>
              <Divider />
            </React.Fragment>
          ))}
          <Flex mt={6} justify="space-between">
            <Button as={RouterLink} to="/products" variant="outline" colorScheme="blue" leftIcon={<FiArrowLeft />}>
              Continue Shopping
            </Button>
          </Flex>
        </Box>

        {/* Order Summary */}
        <Box flex={1} bg="white" p={{base: 4, md:6}} borderRadius="lg" shadow="md" alignSelf="start" position={{lg: "sticky"}} top={{lg: "calc(var(--navbar-height, 60px) + 24px)"}}>
          <Heading size="lg" mb={6}>Order Summary</Heading>
          <Stack spacing={3} mb={6}>
            <Flex justify="space-between">
              <Text color="gray.600">Subtotal</Text>
              <Text fontWeight="medium">₹{subtotal.toLocaleString('en-IN')}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text color="gray.600">Shipping (Standard)</Text>
              <Text fontWeight="medium">₹{shippingCost.toLocaleString('en-IN')}</Text>
            </Flex>
            <Divider />
            <Flex justify="space-between" fontSize="xl">
              <Text fontWeight="bold">Total</Text>
              <Text fontWeight="bold" color="brand.primary">₹{total.toLocaleString('en-IN')}</Text>
            </Flex>
          </Stack>
          <Button as={RouterLink} to="/checkout" colorScheme="green" size="lg" w="full" _hover={{transform: "scale(1.02)"}}>Proceed to Checkout</Button>
          <Text fontSize="xs" color="gray.500" mt={4} textAlign="center">Shipping & taxes calculated at checkout.</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default CartPage;
