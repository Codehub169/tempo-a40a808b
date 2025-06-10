import React, { useState } from 'react';
import { Box, Heading, Text, VStack, FormControl, FormLabel, Input, Button, Checkbox, Link, Tabs, TabList, TabPanels, Tab, TabPanel, useToast, Select, Icon, InputGroup, InputRightElement, HStack } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff, FiLogIn, FiUserPlus } from 'react-icons/fi';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [userType, setUserType] = useState('buyer');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Placeholder login logic
    console.log('Login attempt:', { email: loginEmail, password: loginPassword });
    toast({
      title: 'Login Successful (Mock)',
      description: 'Welcome back!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/'); 
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    // Placeholder signup logic
    console.log('Signup attempt:', { name: signupName, email: signupEmail, password: signupPassword, userType });
    toast({
      title: 'Signup Successful (Mock)',
      description: 'Your account has been created. Please login.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setIsLogin(true); 
  };

  const commonInputProps = {
    bg: 'gray.50',
    borderColor: 'gray.300',
    _hover: { borderColor: 'brand.primary' },
    _focus: { 
        borderColor: 'brand.primary', 
        boxShadow: `0 0 0 1px var(--chakra-colors-brand-primary)` 
    },
  };

  return (
    <Box bg="gray.100" minH="calc(100vh - 120px)" display="flex" alignItems="center" justifyContent="center" py={{ base: 6, md: 12 }}>
      <Box bg="white" p={{ base: 6, sm: 8, md: 10 }} rounded="xl" shadow="2xl" w="full" maxW="lg">
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl" textAlign="center" color="brand.primary">
            Welcome to Re<Text as="span" color="brand.accent">Tech</Text>!
          </Heading>
          <Text textAlign="center" color="gray.600">
            {isLogin ? 'Access your account' : 'Create a new account'}
          </Text>

          <Tabs isFitted variant="enclosed-colored" colorScheme="blue" onChange={(index) => setIsLogin(index === 0)} defaultIndex={0}>
            <TabList mb="1em">
              <Tab _selected={{ color: 'white', bg: 'brand.primary' }}><Icon as={FiLogIn} mr={2} />Login</Tab>
              <Tab _selected={{ color: 'white', bg: 'brand.accent' }}><Icon as={FiUserPlus} mr={2} />Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0}>
                {/* Login Form */}
                <VStack as="form" spacing={5} onSubmit={handleLoginSubmit}>
                  <FormControl isRequired>
                    <FormLabel>Email Address</FormLabel>
                    <InputGroup>
                      <Input type="email" placeholder="you@example.com" {...commonInputProps} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                    </InputGroup>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input type={showLoginPassword ? 'text' : 'password'} placeholder="••••••••" {...commonInputProps} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                      <InputRightElement>
                        <Button variant="ghost" onClick={() => setShowLoginPassword(!showLoginPassword)} aria-label={showLoginPassword ? 'Hide password' : 'Show password'}>
                          <Icon as={showLoginPassword ? FiEyeOff : FiEye} />
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <HStack justifyContent="space-between" w="full">
                    <Checkbox colorScheme="blue" defaultChecked>Remember me</Checkbox>
                    <Link as={RouterLink} to="#" color="brand.primary" _hover={{ textDecoration: 'underline' }} fontSize="sm">
                      Forgot password?
                    </Link>
                  </HStack>
                  <Button type="submit" colorScheme="blue" w="full" size="lg">
                    Sign In
                  </Button>
                </VStack>
              </TabPanel>

              <TabPanel p={0}>
                {/* Signup Form */}
                <VStack as="form" spacing={4} onSubmit={handleSignupSubmit}>
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input type="text" placeholder="John Doe" {...commonInputProps} value={signupName} onChange={(e) => setSignupName(e.target.value)} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email Address</FormLabel>
                    <Input type="email" placeholder="you@example.com" {...commonInputProps} value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input type={showSignupPassword ? 'text' : 'password'} placeholder="Minimum 6 characters" {...commonInputProps} value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                       <InputRightElement>
                        <Button variant="ghost" onClick={() => setShowSignupPassword(!showSignupPassword)} aria-label={showSignupPassword ? 'Hide password' : 'Show password'}>
                          <Icon as={showSignupPassword ? FiEyeOff : FiEye} />
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                     <InputGroup>
                      <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter your password" {...commonInputProps} value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} />
                      <InputRightElement>
                        <Button variant="ghost" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}>
                          <Icon as={showConfirmPassword ? FiEyeOff : FiEye} />
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>I want to:</FormLabel>
                    <Select {...commonInputProps} value={userType} onChange={(e) => setUserType(e.target.value)}>
                      <option value="buyer">Buy Products (Buyer)</option>
                      <option value="seller">Sell Products (Seller)</option>
                    </Select>
                  </FormControl>
                  <Button type="submit" colorScheme="green" w="full" size="lg">
                    Create Account
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Text textAlign="center" fontSize="sm" color="gray.500">
            By signing up, you agree to our{' '}
            <Link as={RouterLink} to="/terms" color="brand.primary" _hover={{ textDecoration: 'underline' }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link as={RouterLink} to="/privacy" color="brand.primary" _hover={{ textDecoration: 'underline' }}>
              Privacy Policy
            </Link>
            .
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default AuthPage;
