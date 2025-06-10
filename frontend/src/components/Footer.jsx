import React from 'react';
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link as ChakraLink,
  VisuallyHidden,
  chakra,
  useColorModeValue,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

/**
 * SocialButton component
 * Renders a styled button for social media links.
 */
const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

/**
 * Footer component
 * Renders the site footer with navigation links, social media icons, and copyright information.
 */
const Footer = () => {
  return (
    <Box
      as="footer"
      bg={useColorModeValue('gray.800', 'gray.900')}
      color={useColorModeValue('gray.300', 'gray.200')}
      py={{ base: 10, md: 12 }}
    >
      <Container as={Stack} maxW={'container.xl'} spacing={8}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack spacing={4} align={{ base: 'center', md: 'flex-start' }}>
            <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
              <Text fontSize="2xl" fontWeight="bold" color="white">
                Re<Text as="span" color="brand.accent">Tech</Text>
              </Text>
            </ChakraLink>
            <Text fontSize={'sm'}>
              Your trusted marketplace for refurbished electronics in India.
            </Text>
            <Stack direction={'row'} spacing={3} pt={2} justifyContent={{ base: 'center', md: 'flex-start' }}>
              <SocialButton label={'Twitter'} href={'#'}><Icon as={FaTwitter} /></SocialButton>
              <SocialButton label={'Instagram'} href={'#'}><Icon as={FaInstagram} /></SocialButton>
              <SocialButton label={'LinkedIn'} href={'#'}><Icon as={FaLinkedinIn} /></SocialButton>
            </Stack>
          </Stack>

          <Stack align={{ base: 'center', md: 'flex-start' }}>
            <Text fontWeight={'md'} fontSize={'lg'} mb={2} color="white">Quick Links</Text>
            <ChakraLink as={RouterLink} to={'/products'} _hover={{ color: 'white' }}>Shop All</ChakraLink>
            <ChakraLink as={RouterLink} to={'/seller/dashboard'} _hover={{ color: 'white' }}>Sell on ReTech</ChakraLink>
            <ChakraLink as={RouterLink} to={'/profile'} _hover={{ color: 'white' }}>My Account</ChakraLink>
            <ChakraLink as={RouterLink} to={'/faq'} _hover={{ color: 'white' }}>Help & FAQ</ChakraLink>
          </Stack>

          <Stack align={{ base: 'center', md: 'flex-start' }}>
            <Text fontWeight={'md'} fontSize={'lg'} mb={2} color="white">Categories</Text>
            <ChakraLink as={RouterLink} to={'/products?category=mobiles'} _hover={{ color: 'white' }}>Mobiles</ChakraLink>
            <ChakraLink as={RouterLink} to={'/products?category=laptops'} _hover={{ color: 'white' }}>Laptops</ChakraLink>
            <ChakraLink as={RouterLink} to={'/products?category=tv'} _hover={{ color: 'white' }}>Televisions</ChakraLink>
            <ChakraLink as={RouterLink} to={'/products?category=appliances'} _hover={{ color: 'white' }}>Appliances</ChakraLink>
          </Stack>

          <Stack align={{ base: 'center', md: 'flex-start' }}>
            <Text fontWeight={'md'} fontSize={'lg'} mb={2} color="white">Contact Us</Text>
            <Text fontSize={'sm'}>Email: support@retech.com</Text>
            <Text fontSize={'sm'}>Phone: +91-1234567890</Text>
          </Stack>
        </SimpleGrid>

        <Flex
          borderTopWidth={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.700', 'gray.600')}
          pt={8}
          mt={8}
          direction={{ base: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          textAlign={{ base: 'center', md: 'left' }}
        >
          <Text fontSize={'sm'}>© {new Date().getFullYear()} ReTech Marketplace. All Rights Reserved.</Text>
          <Text fontSize={'sm'} mt={{ base: 2, md: 0 }}>
            Designed for India, with <chakra.span color="red.500">❤</chakra.span>
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
