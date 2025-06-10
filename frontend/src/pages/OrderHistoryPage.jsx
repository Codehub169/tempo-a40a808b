import React, { useState, useMemo } from 'react';
import { Box, Heading, Text, VStack, HStack, Button, Divider, Tag, Icon, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Select, Input, InputGroup, InputLeftElement, SimpleGrid, Link as ChakraLink, useBreakpointValue, Image } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiShoppingBag, FiCalendar, FiFilter, FiSearch, FiTruck, FiEye, FiPackage } from 'react-icons/fi';

// Placeholder order data
const initialOrders = [
  {
    id: 'ORD123456',
    date: '2024-03-01',
    items: [{ name: 'Refurbished iPhone 12', quantity: 1, image: 'https://placehold.co/50x50/E9ECEF/343A40?text=iP12' }],
    total: 45000,
    status: 'Delivered',
    trackingLink: '#',
  },
  {
    id: 'ORD123457',
    date: '2024-03-10',
    items: [{ name: 'Refurbished Dell Laptop i5', quantity: 1, image: 'https://placehold.co/50x50/E9ECEF/343A40?text=Dell' }, { name: 'Wireless Mouse', quantity: 1, image: 'https://placehold.co/50x50/E9ECEF/343A40?text=Mouse' }],
    total: 29500,
    status: 'Shipped',
    trackingLink: '#',
  },
  {
    id: 'ORD123458',
    date: '2024-03-15',
    items: [{ name: 'Samsung 4K TV Remote', quantity: 1, image: 'https://placehold.co/50x50/E9ECEF/343A40?text=Remote' }],
    total: 800,
    status: 'Processing',
    trackingLink: null,
  },
  {
    id: 'ORD123459',
    date: '2023-12-20',
    items: [{ name: 'LG Washing Machine Filter', quantity: 2, image: 'https://placehold.co/50x50/E9ECEF/343A40?text=Filter' }],
    total: 1200,
    status: 'Delivered',
    trackingLink: '#',
  },
];

const getStatusColorScheme = (status) => {
  if (!status) return 'gray';
  switch (status.toLowerCase()) {
    case 'delivered': return 'green';
    case 'shipped': return 'blue';
    case 'processing': return 'yellow';
    case 'cancelled': return 'red';
    default: return 'gray';
  }
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase())
      .filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent
  }, [orders, filterStatus, searchTerm]);

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box bg="gray.100" minH="calc(100vh - 120px)" py={{ base: 6, md: 12 }}>
      <VStack spacing={8} maxW="container.xl" mx="auto" px={{ base: 4, md: 6 }}>
        <Heading as="h1" size="xl" color="brand.primary" textAlign="center">
          <Icon as={FiShoppingBag} mr={2} verticalAlign="middle" /> My Orders
        </Heading>

        <Box bg="white" p={{ base: 4, md: 8 }} rounded="xl" shadow="xl" w="full">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input 
                placeholder="Search by Order ID or Product Name..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                bg="gray.50"
                borderColor="gray.300"
                _hover={{ borderColor: 'gray.400' }}
                focusBorderColor="brand.primary"
              />
            </InputGroup>
            <Select 
              icon={<FiFilter />} 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)} 
              bg="gray.50"
              borderColor="gray.300"
              _hover={{ borderColor: 'gray.400' }}
              focusBorderColor="brand.primary"
            >
              <option value="all">All Statuses</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </SimpleGrid>

          {filteredOrders.length > 0 ? (
            isMobile ? (
              // Mobile Card View
              <VStack spacing={4} align="stretch">
                {filteredOrders.map(order => (
                  <Box key={order.id} p={4} borderWidth="1px" borderColor="gray.200" rounded="md" shadow="sm">
                    <HStack justifyContent="space-between" mb={2}>
                      <Text fontWeight="bold" color="brand.primary" as={RouterLink} to={`/orders/${order.id}`}>{order.id}</Text>
                      <Tag colorScheme={getStatusColorScheme(order.status)} size="sm">{order.status}</Tag>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" mb={1}><Icon as={FiCalendar} mr={1} verticalAlign="middle" /> {new Date(order.date).toLocaleDateString()}</Text>
                    <Text fontSize="sm" color="gray.600" mb={2}>Total: <Text as="span" fontWeight="bold">₹{order.total.toLocaleString('en-IN')}</Text></Text>
                    <VStack align="start" spacing={1} mb={3}>
                      {order.items.map((item, index) => (
                        <HStack key={index} spacing={2}>
                           {item.image && <Image src={item.image} alt={item.name} boxSize="25px" objectFit="cover" borderRadius="sm" />}
                           <Text fontSize="xs" color="gray.500" noOfLines={1}>{item.name} (Qty: {item.quantity})</Text>
                        </HStack>
                      ))}
                    </VStack>
                    <HStack spacing={2} mt={3}>
                       <Button as={RouterLink} to={`/orders/${order.id}`} size="sm" variant="outline" colorScheme="blue" leftIcon={<FiEye />}>View Details</Button>
                       {order.trackingLink && order.status.toLowerCase() === 'shipped' && (
                          <Button as={ChakraLink} href={order.trackingLink} isExternal size="sm" variant="solid" colorScheme="green" leftIcon={<FiTruck />}>Track Order</Button>
                       )}
                    </HStack>
                  </Box>
                ))}
              </VStack>
            ) : (
              // Desktop Table View
              <TableContainer>
                <Table variant="simple" size="md">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Order ID</Th>
                      <Th>Date</Th>
                      <Th>Items</Th>
                      <Th isNumeric>Total</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredOrders.map(order => (
                      <Tr key={order.id} _hover={{ bg: 'gray.50' }}>
                        <Td fontWeight="medium" color="brand.primary" as={RouterLink} to={`/orders/${order.id}`}>{order.id}</Td>
                        <Td>{new Date(order.date).toLocaleDateString()}</Td>
                        <Td fontSize="sm">
                          {order.items.map(item => item.name).join(', ').substring(0, 40)}{order.items.map(item => item.name).join(', ').length > 40 ? '...' : ''}
                          {order.items.length > 1 && <Text as="span" fontSize="xs" color="gray.500"> (+{order.items.length -1} more)</Text>}
                        </Td>
                        <Td isNumeric fontWeight="medium">₹{order.total.toLocaleString('en-IN')}</Td>
                        <Td><Tag colorScheme={getStatusColorScheme(order.status)}>{order.status}</Tag></Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button as={RouterLink} to={`/orders/${order.id}`} size="sm" variant="outline" colorScheme="blue" leftIcon={<FiEye />}>Details</Button>
                            {order.trackingLink && order.status.toLowerCase() === 'shipped' && (
                                <Button as={ChakraLink} href={order.trackingLink} isExternal size="sm" variant="solid" colorScheme="green" leftIcon={<FiTruck />}>Track</Button>
                            )}
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )
          ) : (
            <VStack spacing={4} py={10} textAlign="center">
              <Icon as={FiPackage} w={16} h={16} color="gray.400" />
              <Text fontSize="xl" fontWeight="medium">No Orders Found</Text>
              <Text color="gray.600">It looks like you haven't placed any orders yet, or no orders match your current filters.</Text>
              <Button as={RouterLink} to="/products" colorScheme="blue">
                Start Shopping
              </Button>
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default OrderHistoryPage;
