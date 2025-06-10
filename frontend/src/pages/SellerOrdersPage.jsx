import React, { useState, useMemo } from 'react';
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Select, Button, Icon, Input, InputGroup, InputLeftElement, VStack, HStack, Tag, Text, useBreakpointValue, SimpleGrid, Card, CardBody, CardHeader, CardFooter, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Link as ChakraLink
} from '@chakra-ui/react';
import { FiSearch, FiEye, FiTruck, FiCheckCircle, FiXCircle, FiArchive, FiFilter } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

// Placeholder data - replace with API calls
const initialSellerOrders = [
  {
    id: 'ORD78901',
    date: '2024-03-10',
    customer: { name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210' },
    items: [{ id: 'prod101', name: 'Refurbished iPhone 11', quantity: 1, price: 32000 }],
    totalAmount: 32000,
    status: 'Pending',
    shippingAddress: { street: '123 Tech Park', city: 'Bangalore', state: 'Karnataka', zip: '560001', country: 'India' },
  },
  {
    id: 'ORD78902',
    date: '2024-03-08',
    customer: { name: 'Amit Singh', email: 'amit@example.com', phone: '8765432109' },
    items: [{ id: 'prod205', name: 'Dell XPS 13 Laptop', quantity: 1, price: 65000 }],
    totalAmount: 65000,
    status: 'Shipped',
    shippingAddress: { street: '456 Silicon Towers', city: 'Hyderabad', state: 'Telangana', zip: '500081', country: 'India' },
    trackingNumber: 'AWB12345XYZ',
  },
  {
    id: 'ORD78903',
    date: '2024-03-05',
    customer: { name: 'Sneha Reddy', email: 'sneha@example.com', phone: '7654321098' },
    items: [{ id: 'prod302', name: 'Samsung 4K Smart TV', quantity: 1, price: 42000 }],
    totalAmount: 42000,
    status: 'Delivered',
    shippingAddress: { street: '789 IT Hub', city: 'Pune', state: 'Maharashtra', zip: '411057', country: 'India' },
  },
  {
    id: 'ORD78904',
    date: '2024-03-11',
    customer: { name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9988776655' },
    items: [
        { id: 'prod110', name: 'Sony WH-1000XM4 Headphones', quantity: 1, price: 22000 },
        { id: 'prod111', name: 'Logitech MX Master 3 Mouse', quantity: 1, price: 8000 }
    ],
    totalAmount: 30000,
    status: 'Processing',
    shippingAddress: { street: '321 Business Bay', city: 'Mumbai', state: 'Maharashtra', zip: '400051', country: 'India' },
  },
  {
    id: 'ORD78905',
    date: '2024-03-01',
    customer: { name: 'Anjali Mehta', email: 'anjali@example.com', phone: '6543210987' },
    items: [{ id: 'prod401', name: 'LG Washing Machine', quantity: 1, price: 18000 }],
    totalAmount: 18000,
    status: 'Cancelled',
    shippingAddress: { street: '987 Commerce Center', city: 'Chennai', state: 'Tamil Nadu', zip: '600002', country: 'India' },
  },
];

const orderStatuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const getStatusColorScheme = (status) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'yellow';
    case 'processing': return 'blue';
    case 'shipped': return 'purple';
    case 'delivered': return 'green';
    case 'cancelled': return 'red';
    default: return 'gray';
  }
};

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState(initialSellerOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => 
        (filterStatus === 'All' || order.status === filterStatus) &&
        (order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())))
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [orders, searchTerm, filterStatus]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => order.id === orderId ? { ...order, status: newStatus } : order)
    );
    // API call to update status would go here
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const isTableView = useBreakpointValue({ base: false, md: true });

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="calc(100vh - 120px)">
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" color="brand.primary">Manage Orders</Heading>
        
        <HStack spacing={4} wrap={{base: "wrap", md: "nowrap"}}>
          <InputGroup flex={2} minW={{base: "100%", md: "300px"}}>
            <InputLeftElement pointerEvents="none"><Icon as={FiSearch} color="gray.400" /></InputLeftElement>
            <Input 
              type="text" 
              placeholder="Search by Order ID, Customer, Product..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              bg="white"
            />
          </InputGroup>
          <FormControl flex={1} minW={{base: "100%", md: "200px"}}>
            <HStack>
                <Icon as={FiFilter} color="gray.600" display={{base: "none", md: "block"}}/>
                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} bg="white">
                {orderStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
                </Select>
            </HStack>
          </FormControl>
        </HStack>

        {filteredOrders.length === 0 ? (
          <Text textAlign="center" p={10} bg="white" borderRadius="md" shadow="sm">No orders found matching your criteria.</Text>
        ) : isTableView ? (
          <Box overflowX="auto" bg="white" shadow="md" borderRadius="lg">
            <Table variant="simple">
              <Thead bg="gray.100">
                <Tr>
                  <Th>Order ID</Th>
                  <Th>Date</Th>
                  <Th>Customer</Th>
                  <Th>Total (₹)</Th>
                  <Th>Status</Th>
                  <Th>Items</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredOrders.map(order => (
                  <Tr key={order.id} _hover={{bg: "gray.50"}}>
                    <Td><ChakraLink as={RouterLink} to={`#`} color="brand.primary" fontWeight="medium">{order.id}</ChakraLink></Td>
                    <Td>{new Date(order.date).toLocaleDateString()}</Td>
                    <Td>{order.customer.name}</Td>
                    <Td isNumeric>{order.totalAmount.toLocaleString()}</Td>
                    <Td>
                      <Tag size="sm" variant="solid" colorScheme={getStatusColorScheme(order.status)}>{order.status}</Tag>
                    </Td>
                    <Td>{order.items.length}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton icon={<FiEye />} size="sm" variant="outline" colorScheme="blue" aria-label="View Details" onClick={() => viewOrderDetails(order)} />
                        <Select 
                            size="sm" 
                            variant="outline"
                            value={order.status} 
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            isDisabled={['Delivered', 'Cancelled'].includes(order.status)}
                            maxW="120px"
                        >
                            {orderStatuses.slice(1).map(s => <option key={s} value={s} disabled={s === 'Pending' && order.status !== 'Pending'}>{s}</option> )}
                        </Select>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
            {filteredOrders.map(order => (
              <Card key={order.id} borderWidth="1px" borderRadius="lg" shadow="sm">
                <CardHeader pb={2}>
                    <Flex justify="space-between" align="center">
                        <Heading size="sm" as={RouterLink} to={`#`} color="brand.primary">{order.id}</Heading>
                        <Tag size="sm" variant="solid" colorScheme={getStatusColorScheme(order.status)}>{order.status}</Tag>
                    </Flex>
                </CardHeader>
                <CardBody py={2}>
                  <Text fontSize="sm"><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</Text>
                  <Text fontSize="sm"><strong>Customer:</strong> {order.customer.name}</Text>
                  <Text fontSize="sm"><strong>Total:</strong> ₹{order.totalAmount.toLocaleString()}</Text>
                  <Text fontSize="sm"><strong>Items:</strong> {order.items.map(i => i.name).join(', ')} ({order.items.length})</Text>
                </CardBody>
                <CardFooter pt={2}>
                    <HStack spacing={2} w="100%">
                        <Button leftIcon={<FiEye />} size="sm" variant="outline" colorScheme="blue" onClick={() => viewOrderDetails(order)} flex={1}>Details</Button>
                        <Select 
                            size="sm" 
                            variant="outline"
                            value={order.status} 
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            isDisabled={['Delivered', 'Cancelled'].includes(order.status)}
                            flex={1.5}
                        >
                            {orderStatuses.slice(1).map(s => <option key={s} value={s} disabled={s === 'Pending' && order.status !== 'Pending'}>{s}</option> )}
                        </Select>
                    </HStack>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </VStack>

      {selectedOrder && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Order Details: {selectedOrder.id}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="stretch" spacing={4}>
                <Text><strong>Status:</strong> <Tag colorScheme={getStatusColorScheme(selectedOrder.status)}>{selectedOrder.status}</Tag></Text>
                <Text><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleDateString()}</Text>
                <Text><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount.toLocaleString()}</Text>
                
                <Box>
                  <Heading size="sm" mb={2}>Customer Information</Heading>
                  <Text><strong>Name:</strong> {selectedOrder.customer.name}</Text>
                  <Text><strong>Email:</strong> {selectedOrder.customer.email}</Text>
                  <Text><strong>Phone:</strong> {selectedOrder.customer.phone}</Text>
                </Box>
                <Box>
                  <Heading size="sm" mb={2}>Shipping Address</Heading>
                  <Text>{selectedOrder.shippingAddress.street}</Text>
                  <Text>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zip}</Text>
                  <Text>{selectedOrder.shippingAddress.country}</Text>
                </Box>
                {selectedOrder.trackingNumber && <Text><strong>Tracking Number:</strong> <ChakraLink href={`#`} isExternal color="brand.primary">{selectedOrder.trackingNumber} <Icon as={FiTruck} /></ChakraLink></Text>}
                
                <Box>
                    <Heading size="sm" mb={2}>Items Ordered ({selectedOrder.items.length})</Heading>
                    {selectedOrder.items.map(item => (
                        <HStack key={item.id} justify="space-between" borderBottomWidth="1px" borderColor="gray.100" py={2}>
                            <Text>{item.name} (Qty: {item.quantity})</Text>
                            <Text>₹{(item.price * item.quantity).toLocaleString()}</Text>
                        </HStack>
                    ))}
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default SellerOrdersPage;
