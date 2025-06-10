import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link as ChakraLink,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  useToast
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingCart, FiChevronDown, FiUser, FiLogOut, FiGrid, FiPackage } from 'react-icons/fi';

// Placeholder for authentication status (to be replaced with AuthContext)
const isAuthenticated = true; // Example: true if user is logged in, false otherwise. NOTE: This will not update on logout without context.
const cartItemCount = 3; // Example: number of items in cart (to be replaced with CartContext)

/**
 * Navbar component
 * Renders the main navigation bar for the application.
 * Includes logo, navigation links, user account menu, cart icon, and a responsive mobile menu.
 */
const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure(); // For mobile menu
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  const NAV_ITEMS = [
    { label: 'All Products', href: '/products' },
    { label: 'Sell with Us', href: '/seller/dashboard' }, // Or a dedicated page for becoming a seller
    { label: 'FAQ', href: '/faq' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token'); // Assuming token is stored with key 'token'
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    navigate('/auth');
    if (isOpen) {
      onToggle(); // Close mobile menu if open
    }
    // In a real app with AuthContext, you would also update the context state here.
  };

  return (
    <Box as="header" bg={useColorModeValue('white', 'gray.900')} 
         px={{ base: 4, md: 6 }}
         py={3} 
         borderBottom={1} 
         borderStyle={'solid'} 
         borderColor={useColorModeValue('gray.200', 'gray.700')} 
         position="sticky" 
         top={0} 
         zIndex="sticky"
         w="100%"
    >
      <Flex maxW="container.xl" mx="auto" alignItems={'center'} justifyContent={'space-between'}>
        {/* Mobile Menu Toggle Button */}
        <Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <Icon as={FiX} w={5} h={5} /> : <Icon as={FiMenu} w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>

        {/* Logo */}
        <Flex flex={{ base: 1, md: 'auto' }} justifyContent={{ base: 'center', md: 'start' }}>
          <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
            <Text fontSize="2xl" fontWeight="bold" color="brand.primary">
              Re<Text as="span" color="brand.accent">Tech</Text>
            </Text>
          </ChakraLink>
        </Flex>

        {/* Desktop Navigation Links */}
        <Stack
          direction={'row'}
          spacing={4}
          display={{ base: 'none', md: 'flex' }}
          alignItems="center"
        >
          {NAV_ITEMS.map((navItem) => (
            <ChakraLink
              as={RouterLink}
              key={navItem.label}
              to={navItem.href}
              p={2}
              fontSize={'sm'}
              fontWeight={isActive(navItem.href) ? 'bold' : 'medium'}
              color={isActive(navItem.href) ? 'brand.primary' : linkColor}
              bg={isActive(navItem.href) ? 'blue.50' : 'transparent'}
              rounded={'md'}
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor,
                bg: isActive(navItem.href) ? 'blue.100' : useColorModeValue('gray.100', 'gray.700'),
              }}
            >
              {navItem.label}
            </ChakraLink>
          ))}
        </Stack>

        {/* Right Side: Account, Cart */}
        <Stack
          flex={{ base: 1, md: 'auto' }}
          justify={'flex-end'}
          direction={'row'}
          spacing={{ base: 2, md: 4 }}
          alignItems="center"
        >
          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
                px={0} // Removed padding for avatar only
              >
                <Avatar
                  size={'sm'}
                  name='User Name' // Replace with actual user name from AuthContext
                  // src='https://bit.ly/broken-link' // Replace with actual user avatar URL or use a default icon
                />
              </MenuButton>
              <MenuList borderColor={useColorModeValue('gray.200', 'gray.700')} zIndex="popover">
                <MenuItem as={RouterLink} to="/profile" icon={<Icon as={FiUser} />}>
                  Buyer Profile
                </MenuItem>
                <MenuItem as={RouterLink} to="/orders" icon={<Icon as={FiPackage} />}>
                  My Orders
                </MenuItem>
                <MenuDivider />
                <MenuItem as={RouterLink} to="/seller/dashboard" icon={<Icon as={FiGrid} />}>
                  Seller Dashboard
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<Icon as={FiLogOut} />} onClick={handleLogout}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              as={RouterLink}
              to="/auth"
              fontSize={'sm'}
              fontWeight={isActive('/auth') ? 'bold' : 'medium'}
              variant={isActive('/auth') ? 'solid' : 'outline'}
              colorScheme={isActive('/auth') ? 'blue' : 'gray'}
              size="sm"
            >
              Login/Sign Up
            </Button>
          )}

          <ChakraLink as={RouterLink} to="/cart" position="relative" p={2} 
            _hover={{bg: useColorModeValue('gray.100', 'gray.700'), rounded: 'md'}}
          >
            <Icon as={FiShoppingCart} h={5} w={5} color={linkColor} />
            {cartItemCount > 0 && (
              <Badge
                position="absolute"
                top="0px"
                right="0px"
                fontSize="0.6em"
                colorScheme="red"
                variant="solid"
                borderRadius="full"
                px={1.5}
              >
                {cartItemCount}
              </Badge>
            )}
          </ChakraLink>
        </Stack>
      </Flex>

      {/* Mobile Navigation Menu */}
      <Collapse in={isOpen} animateOpacity>
        <Stack
          p={4}
          display={{ md: 'none' }}
          borderTopWidth={1}
          borderTopColor={useColorModeValue('gray.200', 'gray.700')}
          mt={2}
        >
          {NAV_ITEMS.map((navItem) => (
            <MobileNavItem key={navItem.label} {...navItem} currentPath={location.pathname} onNavigate={isOpen ? onToggle : undefined} />
          ))}
           {/* Mobile specific auth/account links */}
           {!isAuthenticated && (
             <ChakraLink
                as={RouterLink}
                py={2}
                to={'/auth'}
                justifyContent="space-between"
                alignItems="center"
                _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.50', 'gray.700') }}
                fontWeight={isActive('/auth') ? 'bold' : 'medium'}
                color={isActive('/auth') ? 'brand.primary' : linkColor}
                onClick={isOpen ? onToggle : undefined} // Close menu on click
              >
                Login/Sign Up
              </ChakraLink>
           )}
           {isAuthenticated && (
            <>
             <ChakraLink as={RouterLink} py={2} to="/profile" _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.50', 'gray.700') }} onClick={isOpen ? onToggle : undefined} fontWeight={isActive('/profile') ? 'bold' : 'medium'} color={isActive('/profile') ? 'brand.primary' : linkColor}>Buyer Profile</ChakraLink>
             <ChakraLink as={RouterLink} py={2} to="/orders" _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.50', 'gray.700') }} onClick={isOpen ? onToggle : undefined} fontWeight={isActive('/orders') ? 'bold' : 'medium'} color={isActive('/orders') ? 'brand.primary' : linkColor}>My Orders</ChakraLink>
             <ChakraLink as={RouterLink} py={2} to="/seller/dashboard" _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.50', 'gray.700') }} onClick={isOpen ? onToggle : undefined} fontWeight={isActive('/seller/dashboard') ? 'bold' : 'medium'} color={isActive('/seller/dashboard') ? 'brand.primary' : linkColor}>Seller Dashboard</ChakraLink>
             <ChakraLink py={2} onClick={handleLogout} _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.50', 'gray.700'), cursor: 'pointer' }} color={linkColor}>Logout</ChakraLink>
            </>
           )}
        </Stack>
      </Collapse>
    </Box>
  );
};

/**
 * MobileNavItem component
 * Renders individual navigation items for the mobile menu.
 */
const MobileNavItem = ({ label, children, href, currentPath, onNavigate }) => {
  const { isOpen, onToggle } = useDisclosure();
  const isActive = (path) => currentPath === path;
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={RouterLink}
        to={href}
        onClick={onNavigate} // Close menu on navigation
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: 'none',
          bg: useColorModeValue('gray.50', 'gray.700')
        }}
        fontWeight={isActive(href) ? 'bold' : 'medium'}
        color={isActive(href) ? 'brand.primary' : linkColor}
      >
        <Text fontWeight={isActive(href) ? 600 : 500} color={isActive(href) ? 'brand.primary' : useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {children && (
          <Icon
            as={FiChevronDown}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <ChakraLink as={RouterLink} key={child.label} py={2} to={child.href} onClick={onNavigate} 
                fontWeight={isActive(child.href) ? 'bold' : 'medium'}
                color={isActive(child.href) ? 'brand.primary' : linkColor}
                _hover={{ textDecoration: 'none', color: linkHoverColor }}
              >
                {child.label}
              </ChakraLink>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default Navbar;
