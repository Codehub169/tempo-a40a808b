import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Layout component
 * Provides the basic structure for all pages, including Navbar, content area, and Footer.
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - The page content to be rendered
 */
const Layout = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      {/* Navbar: Positioned at the top */}
      <Navbar />
      {/* Main content area: Takes up available space */}
      <Box as="main" flexGrow={1} py={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }} w="100%">
        {children}
      </Box>
      {/* Footer: Positioned at the bottom */}
      <Footer />
    </Flex>
  );
};

export default Layout;
