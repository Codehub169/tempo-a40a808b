import React, { useState } from 'react';
import { Box, Heading, Text, VStack, HStack, FormControl, FormLabel, Input, Button, Divider, SimpleGrid, Icon, useToast, Avatar, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiTrash2, FiPlusCircle, FiLock, FiSave } from 'react-icons/fi';

// Placeholder user data
const initialUser = {
  name: 'Ananya Sharma',
  email: 'ananya.sharma@example.com',
  phone: '+91 98765 43210',
  avatarUrl: 'https://placehold.co/100x100/007BFF/FFFFFF?text=AS',
};

const initialAddresses = [
  {
    id: '1',
    type: 'Home',
    line1: '123, Sunshine Apartments',
    line2: 'Cross Road, Malad West',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400064',
    isDefault: true,
  },
  {
    id: '2',
    type: 'Office',
    line1: 'Unit 502, Tech Park One',
    line2: 'Cyber City, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400093',
    isDefault: false,
  },
];

const UserProfilePage = () => {
  const [user, setUser] = useState(initialUser);
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const [isEditingAddress, setIsEditingAddress] = useState(null); // stores address id or 'new'
  const [currentAddress, setCurrentAddress] = useState({});
  
  const { isOpen: isAddressModalOpen, onOpen: onAddressModalOpen, onClose: onAddressModalClose } = useDisclosure();
  const { isOpen: isPasswordModalOpen, onOpen: onPasswordModalOpen, onClose: onPasswordModalClose } = useDisclosure();

  const toast = useToast();

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setUser(editedUser);
    setIsEditingProfile(false);
    toast({ title: 'Profile updated successfully!', status: 'success', duration: 2000 });
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAddress(prev => ({ ...prev, [name]: value }));
  };

  const openAddressModal = (address = null) => {
    if (address) {
      setIsEditingAddress(address.id);
      setCurrentAddress(address);
    } else {
      setIsEditingAddress('new');
      setCurrentAddress({ type: 'Home', line1: '', line2: '', city: '', state: '', postalCode: '', isDefault: false });
    }
    onAddressModalOpen();
  };

  const handleSaveAddress = () => {
    if (isEditingAddress === 'new') {
      setAddresses(prev => [...prev, { ...currentAddress, id: Date.now().toString() }]);
      toast({ title: 'Address added!', status: 'success', duration: 2000 });
    } else {
      setAddresses(prev => prev.map(addr => addr.id === isEditingAddress ? { ...currentAddress } : addr));
      toast({ title: 'Address updated!', status: 'success', duration: 2000 });
    }
    onAddressModalClose();
  };

  const handleDeleteAddress = (id) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    toast({ title: 'Address deleted!', status: 'warning', duration: 2000 });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // Placeholder password change logic
    toast({ title: 'Password change request sent (Mock)!', description: 'Check your email for confirmation.', status: 'info', duration: 3000 });
    onPasswordModalClose();
  };

  const commonInputProps = {
    bg: 'gray.50',
    borderColor: 'gray.200',
    _hover: { borderColor: 'brand.primary' },
    _focus: { borderColor: 'brand.primary', boxShadow: `0 0 0 1px var(--chakra-colors-brand-primary)` },
  };

  return (
    <Box bg="gray.100" minH="calc(100vh - 120px)" py={{ base: 6, md: 12 }}>
      <VStack spacing={8} maxW="container.lg" mx="auto" px={{ base: 4, md: 6 }}>
        <Heading as="h1" size="xl" color="brand.primary" textAlign="center">
          My Profile
        </Heading>

        {/* Personal Information Section */}
        <Box bg="white" p={{ base: 6, md: 8 }} rounded="xl" shadow="xl" w="full">
          <HStack justifyContent="space-between" mb={6}>
            <HStack spacing={4}>
              <Avatar size="lg" name={user.name} src={user.avatarUrl} bg="brand.primary" color="white" />
              <VStack align="start" spacing={0}>
                <Heading as="h2" size="lg" color="brand.text">{user.name}</Heading>
                <Text color="gray.500">Manage your personal information.</Text>
              </VStack>
            </HStack>
            {!isEditingProfile ? (
              <Button leftIcon={<FiEdit2 />} colorScheme="blue" variant="outline" onClick={() => { setEditedUser(user); setIsEditingProfile(true); }}>
                Edit Profile
              </Button>
            ) : (
              <HStack>
                <Button leftIcon={<FiSave />} colorScheme="green" onClick={handleSaveProfile}>Save</Button>
                <Button variant="ghost" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
              </HStack>
            )}
          </HStack>
          <Divider mb={6} />
          {isEditingProfile ? (
            <VStack spacing={4} as="form">
              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <Input name="name" value={editedUser.name} onChange={handleProfileInputChange} {...commonInputProps} />
              </FormControl>
              <FormControl>
                <FormLabel>Email Address (Cannot be changed)</FormLabel>
                <Input name="email" value={editedUser.email} {...commonInputProps} isReadOnly />
              </FormControl>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input name="phone" type="tel" value={editedUser.phone} onChange={handleProfileInputChange} {...commonInputProps} />
              </FormControl>
            </VStack>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <HStack><Icon as={FiUser} color="brand.primary" w={5} h={5} /><Text><strong>Name:</strong> {user.name}</Text></HStack>
              <HStack><Icon as={FiMail} color="brand.primary" w={5} h={5} /><Text><strong>Email:</strong> {user.email}</Text></HStack>
              <HStack><Icon as={FiPhone} color="brand.primary" w={5} h={5} /><Text><strong>Phone:</strong> {user.phone}</Text></HStack>
            </SimpleGrid>
          )}
        </Box>

        {/* Saved Addresses Section */}
        <Box bg="white" p={{ base: 6, md: 8 }} rounded="xl" shadow="xl" w="full">
          <HStack justifyContent="space-between" mb={6}>
            <Heading as="h2" size="lg" color="brand.text">Saved Addresses</Heading>
            <Button leftIcon={<FiPlusCircle />} colorScheme="green" onClick={() => openAddressModal()}>Add New Address</Button>
          </HStack>
          <Divider mb={6} />
          {addresses.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {addresses.map(addr => (
                <Box key={addr.id} p={4} borderWidth="1px" borderColor={addr.isDefault ? 'brand.accent' : 'gray.200'} rounded="md" bg={addr.isDefault ? 'green.50' : 'transparent'}>
                  <HStack justifyContent="space-between">
                    <VStack align="start">
                      <Text fontWeight="bold">{addr.type} {addr.isDefault && <Text as="span" color="brand.accent" fontSize="sm">(Default)</Text>}</Text>
                      <Text>{addr.line1}, {addr.line2}</Text>
                      <Text>{addr.city}, {addr.state} - {addr.postalCode}</Text>
                    </VStack>
                    <HStack>
                      <IconButton icon={<FiEdit2 />} aria-label="Edit Address" variant="ghost" onClick={() => openAddressModal(addr)} />
                      <IconButton icon={<FiTrash2 />} aria-label="Delete Address" variant="ghost" colorScheme="red" onClick={() => handleDeleteAddress(addr.id)} />
                    </HStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text color="gray.500">No saved addresses yet. Add one to get started!</Text>
          )}
        </Box>

        {/* Account Security Section */}
        <Box bg="white" p={{ base: 6, md: 8 }} rounded="xl" shadow="xl" w="full">
          <Heading as="h2" size="lg" color="brand.text" mb={6}>Account Security</Heading>
          <Divider mb={6} />
          <Button leftIcon={<FiLock />} colorScheme="blue" variant="outline" onClick={onPasswordModalOpen}>
            Change Password
          </Button>
        </Box>
      </VStack>

      {/* Add/Edit Address Modal */}
      <Modal isOpen={isAddressModalOpen} onClose={onAddressModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditingAddress === 'new' ? 'Add New Address' : 'Edit Address'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} as="form">
              <FormControl isRequired><FormLabel>Type (e.g., Home, Work)</FormLabel><Input name="type" value={currentAddress.type || ''} onChange={handleAddressInputChange} {...commonInputProps} /></FormControl>
              <FormControl isRequired><FormLabel>Address Line 1</FormLabel><Input name="line1" value={currentAddress.line1 || ''} onChange={handleAddressInputChange} {...commonInputProps} /></FormControl>
              <FormControl><FormLabel>Address Line 2</FormLabel><Input name="line2" value={currentAddress.line2 || ''} onChange={handleAddressInputChange} {...commonInputProps} /></FormControl>
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isRequired><FormLabel>City</FormLabel><Input name="city" value={currentAddress.city || ''} onChange={handleAddressInputChange} {...commonInputProps} /></FormControl>
                <FormControl isRequired><FormLabel>State</FormLabel><Input name="state" value={currentAddress.state || ''} onChange={handleAddressInputChange} {...commonInputProps} /></FormControl>
              </SimpleGrid>
              <FormControl isRequired><FormLabel>Postal Code</FormLabel><Input name="postalCode" value={currentAddress.postalCode || ''} onChange={handleAddressInputChange} {...commonInputProps} /></FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveAddress}>Save Address</Button>
            <Button variant="ghost" onClick={onAddressModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={isPasswordModalOpen} onClose={onPasswordModalClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleChangePassword}>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Current Password</FormLabel>
                <Input type="password" name="currentPassword" {...commonInputProps} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>New Password</FormLabel>
                <Input type="password" name="newPassword" {...commonInputProps} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Confirm New Password</FormLabel>
                <Input type="password" name="confirmNewPassword" {...commonInputProps} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue" mr={3}>Save Changes</Button>
            <Button variant="ghost" onClick={onPasswordModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserProfilePage;
