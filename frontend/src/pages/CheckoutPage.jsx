import React, { useState } from 'react';
import { Box, Heading, Text, VStack, HStack, FormControl, FormLabel, Input, Button, Select, Divider, Image, useToast, Icon, SimpleGrid, RadioGroup, Radio, Stack } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiCreditCard, FiMapPin, FiChevronLeft } from 'react-icons/fi';

// Placeholder cart items - in a real app, this would come from CartContext or API
const initialCartItems = [
  {
    id: '1',
    name: 'Refurbished iPhone 12 (128GB, Blue)',
    price: 45000,
    quantity: 1,
    image: 'https://placehold.co/100x100/E9ECEF/343A40?text=iPhone+12',
    seller: 'GadgetRenew Co.'
  },
  {
    id: '2',
    name: 'Refurbished Dell Laptop i5',
    price: 28000,
    quantity: 1,
    image: 'https://placehold.co/100x100/E9ECEF/343A40?text=Dell+Laptop',
    seller: 'TechSavers Inc.'
  },
];

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = subtotal > 500 ? 0 : 50; // Example shipping logic
  const totalAmount = subtotal + shippingCost;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsPlacingOrder(true);

    // Basic validation
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.phone) {
      toast({
        title: 'Missing Shipping Information',
        description: 'Please fill in all required shipping details.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsPlacingOrder(false);
      return;
    }

    // Placeholder for order placement logic
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      console.log('Order placed:', { shippingInfo, cartItems, paymentMethod, totalAmount });
      
      toast({
        title: 'Order Placed!',
        description: 'Thank you for your purchase. Your order is being processed.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      setCartItems([]); // Clear cart
      navigate('/orders'); // Navigate to order history or a confirmation page

    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Order Placement Failed',
        description: 'There was an issue placing your order. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <Box bg="gray.100" minH="calc(100vh - 120px)" py={{ base: 6, md: 12 }}>
      <VStack spacing={8} maxW="container.xl" mx="auto" px={{ base: 4, md: 6 }}>
        <HStack as={RouterLink} to="/cart" spacing={2} alignSelf="flex-start" _hover={{ color: 'brand.primary' }}>
          <Icon as={FiChevronLeft} w={5} h={5} />
          <Text fontWeight="medium">Back to Cart</Text>
        </HStack>

        <Heading as="h1" size="xl" textAlign="center" color="brand.primary">
          Checkout
        </Heading>

        {cartItems.length === 0 ? (
          <VStack spacing={4} py={10} textAlign="center">
            <Icon as={FiShoppingCart} w={16} h={16} color="gray.400" />
            <Text fontSize="xl" fontWeight="medium">Your cart is empty.</Text>
            <Text color="gray.600">You have no items to checkout.</Text>
            <Button as={RouterLink} to="/products" colorScheme="blue" variant="solid" size="lg">
              Continue Shopping
            </Button>
          </VStack>
        ) : (
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, md: 12 }} w="full">
            {/* Shipping & Payment Details Column */}
            <VStack as="form" onSubmit={handlePlaceOrder} spacing={6} align="stretch" bg="white" p={{ base: 6, md: 8 }} rounded="xl" shadow="xl">
              {/* Shipping Address */}
              <VStack spacing={4} align="stretch">
                <HStack spacing={3} alignItems="center">
                  <Icon as={FiMapPin} w={6} h={6} color="brand.primary" />
                  <Heading as="h2" size="lg" color="brand.textDark">Shipping Address</Heading>
                </HStack>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input name="fullName" placeholder="John Doe" value={shippingInfo.fullName} onChange={handleInputChange} bg="gray.50" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Address</FormLabel>
                  <Input name="address" placeholder="123 Main St, Apartment 4B" value={shippingInfo.address} onChange={handleInputChange} bg="gray.50" />
                </FormControl>
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>City</FormLabel>
                    <Input name="city" placeholder="Mumbai" value={shippingInfo.city} onChange={handleInputChange} bg="gray.50" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Postal Code</FormLabel>
                    <Input name="postalCode" placeholder="400001" value={shippingInfo.postalCode} onChange={handleInputChange} bg="gray.50" />
                  </FormControl>
                </SimpleGrid>
                <FormControl isRequired>
                  <FormLabel>Country</FormLabel>
                  <Select name="country" value={shippingInfo.country} onChange={handleInputChange} bg="gray.50">
                    <option value="India">India</option>
                    {/* Add other countries if needed */}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Phone Number</FormLabel>
                  <Input type="tel" name="phone" placeholder="+91 12345 67890" value={shippingInfo.phone} onChange={handleInputChange} bg="gray.50" />
                </FormControl>
              </VStack>

              <Divider />

              {/* Payment Method */}
              <VStack spacing={4} align="stretch">
                <HStack spacing={3} alignItems="center">
                  <Icon as={FiCreditCard} w={6} h={6} color="brand.primary" />
                  <Heading as="h2" size="lg" color="brand.textDark">Payment Method</Heading>
                </HStack>
                <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
                  <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                    <Radio value='creditCard' colorScheme='blue'>Credit/Debit Card</Radio>
                    <Radio value='upi' colorScheme='blue'>UPI</Radio>
                    <Radio value='cod' colorScheme='blue'>Cash on Delivery</Radio>
                  </Stack>
                </RadioGroup>
                {/* Placeholder for card details if 'creditCard' is selected */}
                {paymentMethod === 'creditCard' && (
                  <VStack spacing={3} align="stretch" borderWidth="1px" borderColor="gray.200" p={4} rounded="md">
                    <Text fontSize="sm" color="gray.500">Card details input (placeholder)</Text>
                    <Input placeholder="Card Number" bg="gray.50" />
                    <SimpleGrid columns={2} spacing={3}>
                      <Input placeholder="MM/YY" bg="gray.50" />
                      <Input placeholder="CVC" bg="gray.50" />
                    </SimpleGrid>
                  </VStack>
                )}
              </VStack>
              <Button type="submit" colorScheme="green" size="lg" width="full" mt={4} isLoading={isPlacingOrder} loadingText="Placing Order...">
                Place Order (Total: ₹{totalAmount.toLocaleString('en-IN')})
              </Button>
            </VStack>

            {/* Order Summary Column */}
            <VStack spacing={6} align="stretch" bg="white" p={{ base: 6, md: 8 }} rounded="xl" shadow="xl" h="fit-content" position={{ lg: 'sticky' }} top={{ lg: '100px' }}>
              <Heading as="h2" size="lg" color="brand.textDark">Order Summary</Heading>
              <VStack spacing={4} divider={<Divider />} align="stretch">
                {cartItems.map(item => (
                  <HStack key={item.id} justifyContent="space-between" alignItems="center">
                    <HStack spacing={4} alignItems="center">
                      <Image src={item.image} alt={item.name} boxSize="60px" objectFit="cover" rounded="md" />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium" fontSize="sm" noOfLines={1}>{item.name}</Text>
                        <Text fontSize="xs" color="gray.500">Qty: {item.quantity}</Text>
                        <Text fontSize="xs" color="gray.500">Seller: {item.seller}</Text>
                      </VStack>
                    </HStack>
                    <Text fontWeight="medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</Text>
                  </HStack>
                ))}
              </VStack>
              <Divider />
              <VStack spacing={2} align="stretch">
                <HStack justifyContent="space-between">
                  <Text color="gray.600">Subtotal</Text>
                  <Text fontWeight="medium">₹{subtotal.toLocaleString('en-IN')}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text color="gray.600">Shipping</Text>
                  <Text fontWeight="medium">₹{shippingCost.toLocaleString('en-IN')}</Text>
                </HStack>
                <Divider />
                <HStack justifyContent="space-between" fontSize="xl">
                  <Text fontWeight="bold" color="brand.textDark">Total</Text>
                  <Text fontWeight="bold" color="brand.primary">₹{totalAmount.toLocaleString('en-IN')}</Text>
                </HStack>
              </VStack>
            </VStack>
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};

export default CheckoutPage;
