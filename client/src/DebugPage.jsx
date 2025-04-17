import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Code,
  useColorModeValue,
  Divider,
  Alert,
  AlertIcon,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Link
} from '@chakra-ui/react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';

const DebugPage = () => {
  const [healthResult, setHealthResult] = useState(null);
  const [eventsResult, setEventsResult] = useState(null);
  const [authResult, setAuthResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('red.600', 'red.400');
  const codeBg = useColorModeValue('gray.50', 'gray.700');

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/health');
      setHealthResult(response.data);
      toast({
        title: 'Success',
        description: 'Health check completed',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setError(`Health check failed: ${err.message}`);
      toast({
        title: 'Error',
        description: `Health check failed: ${err.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const checkEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/debug/events');
      setEventsResult(response.data);
      toast({
        title: 'Success',
        description: `Found ${response.data.count} events`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setError(`Events check failed: ${err.message}`);
      toast({
        title: 'Error',
        description: `Events check failed: ${err.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/debug/auth-test', {
        withCredentials: true
      });
      setAuthResult(response.data);
      toast({
        title: 'Success',
        description: 'Auth check completed',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setError(`Auth check failed: ${err.message}`);
      toast({
        title: 'Error',
        description: `Auth check failed: ${err.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Box p={6} bg={bgColor} shadow="md" borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
        <VStack spacing={6} align="stretch">
          <Flex justify="space-between" align="center">
            <Heading color={headingColor} size="lg">API Debug Tools</Heading>
            <Link as={RouterLink} to="/" color="blue.500">Back to Home</Link>
          </Flex>

          <Text>Use these tools to diagnose API connection issues.</Text>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Box>
            <Button
              colorScheme="blue"
              onClick={checkHealth}
              isLoading={loading}
              mr={4}
            >
              Check Server Health
            </Button>

            <Button
              colorScheme="green"
              onClick={checkEvents}
              isLoading={loading}
              mr={4}
            >
              Check Events
            </Button>

            <Button
              colorScheme="purple"
              onClick={checkAuth}
              isLoading={loading}
            >
              Check Auth
            </Button>
          </Box>

          <Divider />

          <Accordion allowToggle>
            {healthResult && (
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Health Check Result
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} bg={codeBg}>
                  <Code display="block" whiteSpace="pre" p={4} borderRadius="md">
                    {JSON.stringify(healthResult, null, 2)}
                  </Code>
                </AccordionPanel>
              </AccordionItem>
            )}

            {eventsResult && (
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Events Result ({eventsResult.count} events)
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} bg={codeBg}>
                  <Code display="block" whiteSpace="pre" p={4} borderRadius="md" maxHeight="400px" overflow="auto">
                    {JSON.stringify(eventsResult, null, 2)}
                  </Code>
                </AccordionPanel>
              </AccordionItem>
            )}

            {authResult && (
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Auth Check Result
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} bg={codeBg}>
                  <Code display="block" whiteSpace="pre" p={4} borderRadius="md">
                    {JSON.stringify(authResult, null, 2)}
                  </Code>
                </AccordionPanel>
              </AccordionItem>
            )}
          </Accordion>

          <Divider />

          <Box>
            <Heading size="md" mb={2}>Troubleshooting Steps</Heading>
            <VStack align="start" spacing={2}>
              <Text>1. Check if the server is running and accessible</Text>
              <Text>2. Verify that events exist in the database</Text>
              <Text>3. Test authentication cookie handling</Text>
              <Text>4. Check browser console for CORS errors</Text>
              <Text>5. Try clearing cookies and cache</Text>
            </VStack>
          </Box>

          <Link as={RouterLink} to="/admin" color="blue.500">
            Go to Admin Login
          </Link>
        </VStack>
      </Box>
    </Container>
  );
};

export default DebugPage;
