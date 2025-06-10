import React from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Button, Icon, VStack, Text, Card, CardHeader, CardBody, CardFooter, Divider, Flex } from '@chakra-ui/react';
import { FiPlusCircle, FiList, FiShoppingCart, FiUser, FiDollarSign, FiTrendingUp, FiPackage } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const SellerDashboardPage = () => {
  // Placeholder data - replace with API calls
  const stats = [
    { label: 'Total Sales', value: '₹1,25,000', change: '12%', type: 'increase', icon: FiDollarSign },
    { label: 'Active Listings', value: '75', change: '5', type: 'increase', icon: FiList },
    { label: 'Pending Orders', value: '12', change: '2', type: 'decrease', icon: FiShoppingCart },
    { label: 'Total Products Sold', value: '210', change: '15', type: 'increase', icon: FiPackage },
  ];

  const quickActions = [
    { label: 'Add New Product', icon: FiPlusCircle, path: '/add-product' },
    { label: 'Manage Listings', icon: FiList, path: '/manage-products' }, // Assuming a page for managing all listings
    { label: 'View Orders', icon: FiShoppingCart, path: '/seller-orders' },
    { label: 'Edit Seller Profile', icon: FiUser, path: '/profile' }, // Links to general user profile, could be more specific
  ];

  const recentActivity = [
    { type: 'New Order', description: 'Order #1025 for iPhone 11', time: '2 hours ago' },
    { type: 'Product Listed', description: 'Samsung Galaxy S20 published', time: '5 hours ago' },
    { type: 'Stock Alert', description: 'Dell XPS 13 - Low Stock (2 left)', time: '1 day ago', color: 'orange.500' },
    { type: 'Order Shipped', description: 'Order #1023 (Macbook Air) marked as shipped', time: '2 days ago' },
  ];

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="calc(100vh - 120px)">
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" mb={4} color="brand.primary">
          Seller Dashboard
        </Heading>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          {stats.map((stat, index) => (
            <Card key={index} borderWidth="1px" borderColor="gray.200" borderRadius="lg" shadow="sm" _hover={{ shadow: "md"}}>
              <CardBody>
                <Flex align="center">
                    <Icon as={stat.icon} boxSize={8} color="brand.primary" mr={4} />
                    <Box>
                        <StatLabel color="gray.600">{stat.label}</StatLabel>
                        <StatNumber fontSize="2xl" fontWeight="bold">{stat.value}</StatNumber>
                        <StatHelpText>
                        <StatArrow type={stat.type === 'increase' ? 'increase' : 'decrease'} />
                        {stat.change} {stat.type === 'increase' ? 'Up' : 'Down'} from last month
                        </StatHelpText>
                    </Box>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Quick Actions */}
        <Box>
          <Heading as="h2" size="lg" mb={4} color="gray.700">Quick Actions</Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
            {quickActions.map((action) => (
              <Button
                key={action.label}
                as={RouterLink}
                to={action.path}
                leftIcon={<Icon as={action.icon} />}
                colorScheme="blue"
                variant="outline"
                size="lg"
                w="100%"
                justifyContent="flex-start"
                py={6}
                _hover={{ bg: 'blue.50'}}
              >
                {action.label}
              </Button>
            ))}
          </SimpleGrid>
        </Box>

        {/* Recent Activity */}
        <Box>
          <Heading as="h2" size="lg" mb={4} color="gray.700">Recent Activity</Heading>
          <Card borderWidth="1px" borderColor="gray.200" borderRadius="lg" shadow="sm">
            <CardBody>
              <VStack divider={<Divider />} spacing={4} align="stretch">
                {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                  <Flex key={index} justify="space-between" align="center" py={2}>
                    <Box>
                      <Text fontWeight="medium" color={activity.color || 'gray.800'}>{activity.type}</Text>
                      <Text fontSize="sm" color="gray.600">{activity.description}</Text>
                    </Box>
                    <Text fontSize="xs" color="gray.500">{activity.time}</Text>
                  </Flex>
                )) : (
                  <Text color="gray.500">No recent activity.</Text>
                )}
              </VStack>
            </CardBody>
          </Card>
        </Box>

      </VStack>
    </Box>
  );
};

export default SellerDashboardPage;
