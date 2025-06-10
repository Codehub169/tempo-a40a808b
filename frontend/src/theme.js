import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    primary: '#007BFF',      // Bright Blue (Primary buttons, links, key UI elements)
    secondary: '#F8F9FA',    // Light Gray (Clean background, containers, separators)
    accent: '#28A745',       // Green (Success, 'Add to Cart', positive actions, sustainability hint)
    textDark: '#343A40',     // Dark Gray (Primary text content)
    textMedium: '#6C757D',   // Medium Gray (Secondary text, icons, placeholders)
    borderLight: '#E9ECEF',  // Lighter Gray (Borders, dividers)
    // Additional neutrals from plan if needed directly in Chakra
    // Neutral Dark: '#343A40' (already textDark)
    // Neutral Medium: '#6C757D' (already textMedium)
    // Neutral Light: '#E9ECEF' (already borderLight)
  },
  status: {
    success: '#28A745',      // Green
    warning: '#FFC107',      // Yellow
    error: '#DC3545',        // Red
  },
  // Complementary colors from Tailwind config if used directly with Chakra
  blue: {
    600: '#007BFF', // Matching primary
    700: '#0056b3', // Darker shade for hover, e.g., scrollbar thumb hover
  },
  green: {
    500: '#28A745', // Matching accent
    600: '#1e7e34', // Darker shade for hover
  },
  gray: {
    50: '#F8F9FA',    // Matching secondary for backgrounds
    100: '#E9ECEF',   // Matching borderLight
    200: '#dee2e6',
    300: '#ced4da',
    600: '#6C757D',   // Matching textMedium
    700: '#495057',
    800: '#343A40',   // Matching textDark
  }
};

const fonts = {
  heading: `'Montserrat', sans-serif`,
  body: `'Poppins', sans-serif`,
};

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  styles: {
    global: (props) => ({
      body: {
        fontFamily: 'body',
        color: 'brand.textDark',
        bg: props.colorMode === 'dark' ? 'gray.800' : 'brand.secondary', // Using brand.secondary for light mode bg
        lineHeight: 'base',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      '*::placeholder': {
        color: 'brand.textMedium',
      },
      'h1, h2, h3, h4, h5, h6': {
        fontFamily: 'heading',
        fontWeight: 'semibold', // Montserrat is often used with semibold or bold
      },
      // Custom scrollbar styling to match HTML previews
      '::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: colors.brand.secondary, // Light Gray background for track
        borderRadius: '10px',
      },
      '::-webkit-scrollbar-thumb': {
        background: colors.brand.primary, // Bright Blue for thumb
        borderRadius: '10px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: colors.blue[700], // Darker Blue for thumb hover
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontFamily: 'body', // Poppins for buttons as per typical usage
        fontWeight: 'semibold', 
      },
      // Example: Define variants to match Tailwind button styles if needed
      // variants: {
      //   'btn-primary': {
      //     bg: 'brand.primary',
      //     color: 'white',
      //     _hover: {
      //       bg: 'blue.700',
      //     },
      //   },
      //   'btn-accent': {
      //     bg: 'brand.accent',
      //     color: 'white',
      //     _hover: {
      //       bg: 'green.600',
      //     },
      //   },
      // },
    },
    // Extend other Chakra components as needed to align with Tailwind/Design System
  },
});

export default theme;
