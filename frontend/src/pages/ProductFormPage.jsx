import React, { useState, useEffect } from 'react';
import {
  Box, Heading, FormControl, FormLabel, Input, Textarea, Select, RadioGroup, Radio, Stack, Button, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, SimpleGrid, Image, IconButton, VStack, HStack, FormHelperText, useToast, CheckboxGroup, Checkbox, Tag, TagLabel, TagCloseButton
} from '@chakra-ui/react';
import { FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';

// Placeholder data - replace with API calls
const categories = ['Mobiles', 'Laptops', 'Televisions', 'Appliances', 'Cameras', 'Audio'];
const brands = ['Apple', 'Samsung', 'Dell', 'LG', 'Sony', 'HP', 'Generic'];
const conditions = [
  { label: 'Brand New (Sealed)', value: 'new_sealed' },
  { label: 'Like New (Open Box)', value: 'like_new' },
  { label: 'Excellent', value: 'excellent' },
  { label: 'Good', value: 'good' },
  { label: 'Fair', value: 'fair' },
];

const ProductFormPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEditing = Boolean(productId);

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [stock, setStock] = useState(1);
  const [condition, setCondition] = useState('good');
  const [images, setImages] = useState([]); // Array of File objects or image URLs for editing
  const [imagePreviews, setImagePreviews] = useState([]);
  const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');

  useEffect(() => {
    if (isEditing) {
      // Fetch product data if editing - Placeholder
      console.log(`Fetching product ${productId} for editing`);
      // Mock data for editing:
      setProductName('Refurbished iPhone X');
      setDescription('Excellent condition iPhone X, 64GB, Space Gray. Fully tested and functional.');
      setCategory('Mobiles');
      setBrand('Apple');
      setPrice('25000');
      setDiscountedPrice('22500');
      setStock(5);
      setCondition('excellent');
      setImagePreviews(['https://placehold.co/300x200?text=iPhone+X+1', 'https://placehold.co/300x200?text=iPhone+X+2']);
      setSpecifications([{ key: 'Storage', value: '64GB' }, { key: 'Color', value: 'Space Gray' }]);
      setTags(['smartphone', 'apple', 'refurbished']);
    }
  }, [productId, isEditing]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files].slice(0, 5)); // Limit to 5 images
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 5));
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // If original image was a URL (during edit), it won't be revoked.
      // For new Blobs, revoke object URL to free memory.
      if (images[index] instanceof File) {
        URL.revokeObjectURL(imagePreviews[index]);
      }
      return updated;
    });
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const addSpecField = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecField = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag.toLowerCase()) && tags.length < 10) {
      setTags([...tags, currentTag.toLowerCase()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic Validation
    if (!productName || !category || !brand || !price || !stock || !condition || imagePreviews.length === 0) {
        toast({ title: 'Missing Fields', description: 'Please fill all required fields and upload at least one image.', status: 'error', duration: 3000, isClosable: true });
        return;
    }
    
    const formData = {
      productName, description, category, brand, price, discountedPrice, stock, condition,
      images, // In a real app, these would be uploaded, and URLs stored
      imagePreviews, // for display logic if needed, but backend gets `images`
      specifications: specifications.filter(spec => spec.key && spec.value),
      tags
    };
    console.log('Product Data:', formData);
    toast({
      title: isEditing ? 'Product Updated' : 'Product Added',
      description: `${productName} has been successfully ${isEditing ? 'updated' : 'added'}.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    // navigate(isEditing ? `/product/${productId}` : '/seller-dashboard'); // Navigate after submit
    if (!isEditing) {
        // Reset form for new product
        setProductName(''); setDescription(''); setCategory(''); setBrand('');
        setPrice(''); setDiscountedPrice(''); setStock(1); setCondition('good');
        setImages([]); setImagePreviews([]); setSpecifications([{ key: '', value: '' }]);
        setTags([]); setCurrentTag('');
    } else {
        navigate(`/seller-dashboard`); // Or to product page
    }
  };

  return (
    <Box p={{ base: 4, md: 8 }} maxW="3xl" mx="auto" bg="white" shadow="lg" borderRadius="lg" my={8}>
      <Heading as="h1" size="xl" mb={6} textAlign="center" color="brand.primary">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel>Product Name</FormLabel>
            <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., Refurbished iPhone 12 Pro" />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed description of the product, its condition, and any accessories included." rows={5}/>
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select placeholder="Select category" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Brand</FormLabel>
              <Select placeholder="Select brand" value={brand} onChange={(e) => setBrand(e.target.value)}>
                {brands.map(br => <option key={br} value={br}>{br}</option>)}
              </Select>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isRequired>
              <FormLabel>Price (₹)</FormLabel>
              <NumberInput min={0} value={price} onChange={(val) => setPrice(val)}>
                <NumberInputField placeholder="e.g., 25000"/>
                <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Discounted Price (₹) (Optional)</FormLabel>
              <NumberInput min={0} value={discountedPrice} onChange={(val) => setDiscountedPrice(val)}>
                <NumberInputField placeholder="e.g., 22500" />
                <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
              </NumberInput>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isRequired>
              <FormLabel>Stock Quantity</FormLabel>
              <NumberInput min={0} value={stock} onChange={(val) => setStock(val)}>
                <NumberInputField />
                <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Condition</FormLabel>
              <Select placeholder="Select condition" value={condition} onChange={(e) => setCondition(e.target.value)}>
                {conditions.map(cond => <option key={cond.value} value={cond.value}>{cond.label}</option>)}
              </Select>
            </FormControl>
          </SimpleGrid>
          
          <FormControl isRequired={imagePreviews.length === 0}>
            <FormLabel>Product Images (up to 5)</FormLabel>
            <Input type="file" multiple accept="image/*" onChange={handleImageChange} p={1.5} variant="filled"/>
            <FormHelperText>Upload at least one image. Max 5 images.</FormHelperText>
            <SimpleGrid columns={{ base: 2, md: 3, lg:5 }} spacing={4} mt={4}>
              {imagePreviews.map((src, index) => (
                <Box key={index} position="relative" borderWidth="1px" borderRadius="md" overflow="hidden">
                  <Image src={src} alt={`Preview ${index + 1}`} boxSize="120px" objectFit="cover" />
                  <IconButton icon={<FiTrash2 />} size="xs" colorScheme="red" variant="solid" position="absolute" top={1} right={1} onClick={() => removeImage(index)} aria-label="Remove image"/>
                </Box>
              ))}
            </SimpleGrid>
          </FormControl>

          <FormControl>
            <FormLabel>Specifications</FormLabel>
            <VStack spacing={3} align="stretch">
              {specifications.map((spec, index) => (
                <HStack key={index} spacing={2}>
                  <Input placeholder="Key (e.g., RAM)" value={spec.key} onChange={(e) => handleSpecChange(index, 'key', e.target.value)} />
                  <Input placeholder="Value (e.g., 8GB)" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} />
                  <IconButton icon={<FiTrash2 />} onClick={() => removeSpecField(index)} aria-label="Remove specification" isDisabled={specifications.length === 1 && !spec.key && !spec.value} />
                </HStack>
              ))}
              <Button leftIcon={<FiPlus />} onClick={addSpecField} size="sm" alignSelf="flex-start">Add Specification</Button>
            </VStack>
          </FormControl>

          <FormControl>
            <FormLabel>Tags (Optional)</FormLabel>
            <HStack>
                <Input 
                    value={currentTag} 
                    onChange={(e) => setCurrentTag(e.target.value)} 
                    placeholder="e.g., gaming, 16inch, lightweight" 
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button onClick={handleAddTag} isDisabled={tags.length >=10}>Add Tag</Button>
            </HStack>
            <HStack spacing={2} mt={2} wrap="wrap">
                {tags.map((tag, index) => (
                    <Tag key={index} size="md" variant="solid" colorScheme="blue" borderRadius="full">
                        <TagLabel>{tag}</TagLabel>
                        <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                    </Tag>
                ))}
            </HStack>
            <FormHelperText>Max 10 tags. Press Enter or click 'Add Tag'.</FormHelperText>
          </FormControl>

          <Button type="submit" colorScheme="green" size="lg" isLoading={false /* Add loading state */}>
            {isEditing ? 'Save Changes' : 'Add Product'}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ProductFormPage;
