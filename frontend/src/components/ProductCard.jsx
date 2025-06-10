import React from 'react';
import {
  Box,
  Image,
  Text,
  Badge,
  Button,
  VStack,
  LinkBox,
  LinkOverlay,
  useColorModeValue,
  Flex,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';

/**
 * ProductCard component
 * Displays a single product in a card format, including image, name, condition, price, and an Add to Cart button.
 * @param {object} props - Component props
 * @param {object} props.product - The product object to display.
 * Expected product object structure: { id, name, images, condition, price, originalPrice, sellerName, category }
 */
const ProductCard = ({ product }) => {
  const { id, name, images, condition, price, originalPrice, sellerName, category } = product;
  const toast = useToast();

  // Fallback image if product.images is not available or empty
  const imageUrl = images && images.length > 0 ? images[0] : `https://placehold.co/300x200/E9ECEF/343A40?text=${name.split(' ').join('+')}`;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation if card is wrapped in LinkBox
    // Placeholder: Add to cart logic (e.g., update context, API call)
    toast({
      title: 'Product Added!',
      description: `${name} has been added to your cart.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
    console.log(`Added ${name} to cart.`);
  };

  const getConditionColorScheme = () => {
    if (!condition) return 'gray';
    switch (condition.toLowerCase()) {
      case 'excellent':
      case 'like new':
        return 'green';
      case 'very good':
        return 'teal';
      case 'good':
        return 'blue';
      case 'fair':
      case 'acceptable':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <LinkBox 
      as={VStack}
      bg={useColorModeValue('white', 'gray.800')}
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      rounded="lg"
      shadow="md"
      overflow="hidden"
      spacing={0}
      alignItems="stretch"
      transition="all 0.2s ease-in-out"
      _hover={{
        shadow: 'xl',
        transform: 'translateY(-4px)',
      }}
      w="100%"
      h="100%" // Ensure cards in a grid have same height
      pb={4} // Add padding to bottom for button
    >
      <Box position="relative" w="100%" pb="75%"> {/* Aspect ratio box for image */}
        <Image
          src={imageUrl}
          alt={name}
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          objectFit="cover"
        />
      </Box>

      <VStack p={4} spacing={2} alignItems="flex-start" flexGrow={1} w="100%">
        {condition && (
          <Badge colorScheme={getConditionColorScheme()} fontSize="xs" px={2} py={0.5} rounded="md">
            Condition: {condition}
          </Badge>
        )}
        <LinkOverlay as={RouterLink} to={`/products/${category}/${id}`}>
          <Text
            fontSize="md"
            fontWeight="semibold"
            lineHeight="tight"
            noOfLines={2} // Ensure consistent height for title
            minH="2.5em" // Approx 2 lines height
            _hover={{ color: 'brand.primary' }}
          >
            {name}
          </Text>
        </LinkOverlay>
        
        {sellerName && (
            <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')}>
                Sold by: {sellerName}
            </Text>
        )}

        <Flex alignItems="baseline" mt="auto" pt={2} w="100%"> {/* Push price to bottom */}
          <Text fontSize="xl" fontWeight="bold" color="brand.primary">
            ₹{price.toLocaleString('en-IN')}
          </Text>
          {originalPrice && (
            <Text as="span" ml={2} fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')} textDecoration="line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </Text>
          )}
        </Flex>
      </VStack>
      
      <Box px={4} w="100%" mt="auto"> {/* Ensure button is at the bottom of the card content */}
        <Button
          w="full"
          colorScheme="green" // Using green as accent for add to cart
          variant="solid"
          size="sm"
          leftIcon={<Icon as={FiShoppingCart} />}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </Box>
    </LinkBox>
  );
};

export default ProductCard;
