import React, { useState, useMemo } from 'react';
import {
  Box, Heading, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, VStack, Text, InputGroup, InputLeftElement, Input, Icon, Tabs, TabList, Tab, TabPanels, TabPanel, SimpleGrid
} from '@chakra-ui/react';
import { FiSearch, FiHelpCircle } from 'react-icons/fi';

// Placeholder FAQ data - replace with API calls or static content management
const faqData = {
  buyer: [
    { q: 'How do I know the quality of refurbished products?', a: 'All products listed on ReTech undergo a rigorous quality check by certified sellers. The condition (e.g., Excellent, Good, Fair) is clearly stated on the product page. We encourage sellers to provide detailed descriptions and images.' },
    { q: 'What kind of warranty is offered?', a: 'Warranty terms vary by seller and product, and are specified on each product detail page. Most sellers offer a minimum of 3-6 months warranty. ReTech also provides a 7-day return policy for most items if they do not match the description.' },
    { q: 'How does shipping work?', a: 'Shipping is handled directly by the sellers. Estimated delivery times are shown on the product page. You can track your order from your account once it is shipped.' },
    { q: 'Can I return a product?', a: 'Yes, most products can be returned within 7 days of delivery if they are defective, damaged, or not as described. Please check the specific return policy on the product page and our general Returns Policy for more details.' },
    { q: 'How do I make a payment?', a: 'We accept various payment methods including credit/debit cards, net banking, UPI, and popular wallets through our secure payment gateway.' },
  ],
  seller: [
    { q: 'How do I start selling on ReTech?', a: 'You can register as a seller by choosing the "Seller" option during signup. Once your profile is approved, you can start listing your refurbished products through your Seller Dashboard.' },
    { q: 'What are the fees for selling?', a: 'ReTech charges a small commission fee on successful sales. The exact fee structure will be communicated to you during seller onboarding and is available in your Seller Agreement.' },
    { q: 'How do I list my products?', a: 'Our platform provides an easy-to-use form to list your products, including details like specifications, condition, images, price, and warranty. You can manage your listings from your Seller Dashboard.' },
    { q: 'How do I get paid?', a: 'Payments for your sales (after deducting applicable fees) are transferred to your registered bank account within a specified payout cycle, typically 7-10 business days after successful delivery and confirmation.' },
    { q: 'What are my responsibilities as a seller?', a: 'Sellers are responsible for accurately describing products, ensuring quality, managing inventory, packing and shipping orders promptly, and handling customer queries related to their products and warranty.' },
  ],
  general: [
    { q: 'What is ReTech?', a: 'ReTech is an online marketplace dedicated to refurbished electronics in India. We connect buyers looking for quality, affordable gadgets with trusted sellers of certified refurbished products.' },
    { q: 'Is it safe to buy refurbished electronics?', a: 'Yes, when bought from a trusted source. Refurbished products on ReTech are quality-checked and often come with a warranty, offering a reliable and cost-effective alternative to new devices.' },
    { q: 'How does ReTech ensure product authenticity?', a: 'We have a seller verification process and encourage transparent listings. Buyers can also review seller ratings and product reviews to make informed decisions. We take fraudulent listings very seriously.' },
  ],
};

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const currentFAQs = useMemo(() => {
    const categories = ['buyer', 'seller', 'general'];
    const currentCategory = categories[activeTab];
    const faqs = faqData[currentCategory] || [];

    if (!searchTerm) return faqs;
    return faqs.filter(
      (faq) =>
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, activeTab]);

  const allFAQsForSearch = useMemo(() => {
    if (!searchTerm) return []; // Don't show all if no search term
    const all = [...faqData.buyer, ...faqData.seller, ...faqData.general];
    return all.filter(
        (faq) =>
          faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm]);

  const handleTabChange = (index) => {
    setActiveTab(index);
    // setSearchTerm(''); // Optionally clear search when changing tabs
  };

  return (
    <Box p={{ base: 4, md: 8 }} maxW="4xl" mx="auto">
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Icon as={FiHelpCircle} boxSize={12} color="brand.primary" mb={2} />
          <Heading as="h1" size="2xl" color="brand.primary">
            Frequently Asked Questions
          </Heading>
          <Text mt={2} fontSize="lg" color="gray.600">
            Find answers to common questions about buying and selling on ReTech.
          </Text>
        </Box>

        <InputGroup size="lg" shadow="sm" borderRadius="md">
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search FAQs... (e.g., warranty, returns, listing)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="white"
          />
        </InputGroup>

        {searchTerm ? (
             <Accordion allowMultiple allowToggle defaultIndex={allFAQsForSearch.map((_,i) => i)} width="100%">
             {allFAQsForSearch.length > 0 ? (
               allFAQsForSearch.map((faq, index) => (
                 <AccordionItem key={`search-${index}`} bg="white" borderRadius="md" mb={3} shadow="sm">
                   <h2>
                     <AccordionButton _expanded={{ bg: 'blue.50', color: 'brand.primary' }} py={4}>
                       <Box flex="1" textAlign="left" fontWeight="medium">
                         {faq.q}
                       </Box>
                       <AccordionIcon />
                     </AccordionButton>
                   </h2>
                   <AccordionPanel pb={4} color="gray.700" borderTopWidth="1px" borderColor="gray.100">
                     {faq.a}
                   </AccordionPanel>
                 </AccordionItem>
               ))
             ) : (
               <Text textAlign="center" p={5} bg="white" borderRadius="md" shadow="sm">No FAQs found matching your search.</Text>
             )}
           </Accordion>
        ) : (
            <Tabs isLazy index={activeTab} onChange={handleTabChange} variant="soft-rounded" colorScheme="blue">
                <TabList justifyContent="center" mb={6} flexWrap="wrap">
                    <Tab _focus={{ boxShadow: 'none' }} mx={1} my={1}>For Buyers</Tab>
                    <Tab _focus={{ boxShadow: 'none' }} mx={1} my={1}>For Sellers</Tab>
                    <Tab _focus={{ boxShadow: 'none' }} mx={1} my={1}>General</Tab>
                </TabList>
                <TabPanels>
                    {['buyer', 'seller', 'general'].map((categoryKey, catIndex) => (
                        <TabPanel key={categoryKey} p={0}>
                            <Accordion allowMultiple allowToggle width="100%">
                            {faqData[categoryKey].length > 0 ? (
                                faqData[categoryKey].map((faq, index) => (
                                <AccordionItem key={`${categoryKey}-${index}`} bg="white" borderRadius="md" mb={3} shadow="sm">
                                    <h2>
                                    <AccordionButton _expanded={{ bg: 'blue.50', color: 'brand.primary' }} py={4}>
                                        <Box flex="1" textAlign="left" fontWeight="medium">
                                        {faq.q}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4} color="gray.700" borderTopWidth="1px" borderColor="gray.100">
                                    {faq.a}
                                    </AccordionPanel>
                                </AccordionItem>
                                ))
                            ) : (
                                <Text>No FAQs in this category yet.</Text>
                            )}
                            </Accordion>
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>
        )}
      </VStack>
    </Box>
  );
};

export default FAQPage;
