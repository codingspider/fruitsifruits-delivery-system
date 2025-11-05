import {React, useState, useEffect} from 'react';
'use client'
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputRightElement,
  InputGroup,
  useToast,

} from '@chakra-ui/react';

import { Link as ReactRouterLink } from 'react-router-dom';
import { Link as ChakraLink } from '@chakra-ui/react';
import { FORGOT } from '../../router';
import { loginUser } from '../../services/authService';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { SUPER_ADMIN_BASE, ADMIN_BASE, DRIVER_BASE, STAFF_BASE, DASHBOARD } from '../../router';

export default function Login() {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
      const storedToken = localStorage.getItem('auth_token');
      const role = localStorage.getItem('role');

      if (storedToken && role === 'superadmin') {
          navigate(`${SUPER_ADMIN_BASE}/${DASHBOARD}`);
      } else if (storedToken && role === 'admin') {
          navigate(`${ADMIN_BASE}/${DASHBOARD}`);
      } else if (storedToken && role === 'driver') {
          navigate(`${DRIVER_BASE}/${DASHBOARD}`);
      } else if (storedToken && role === 'jps') {
          navigate(`${STAFF_BASE}/${DASHBOARD}`);
      }

  }, [navigate]);

  const onSubmit = async (data) => {
        setIsSubmitting(true);
        const { login, password } = data;
        try {
            const res = await loginUser(login, password);
            localStorage.setItem('auth_token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('favicon', res.data.favicon);
            localStorage.setItem('logo', res.data.logo);
            localStorage.setItem('app_name', res.data.app_name);
            localStorage.setItem('name', res.data.name);
            localStorage.setItem('lat_long', res.data.lat_long);
            localStorage.setItem('map_api_key', res.data.map_api_key);
            localStorage.setItem("currency", res.data.currency);
            localStorage.setItem("locale", res.data.locale);

            toast({
                position: 'bottom-right',
                title: 'Login successful!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            if (res.data.token && res.data.role === 'superadmin') {
                navigate(`${SUPER_ADMIN_BASE}/${DASHBOARD}`);
            } else if (res.data.token && res.data.role === 'admin') {
                navigate(`${ADMIN_BASE}/${DASHBOARD}`);
            } else if (res.data.token && res.data.role === 'driver') {
                navigate(`${DRIVER_BASE}/${DASHBOARD}`);
            } else if (res.data.token && res.data.role === 'jps') {
                navigate(`${STAFF_BASE}/${DASHBOARD}`);
            }
        } catch (err) {
            const errorMessage =
                err?.response?.data?.message || err.message || 'Something went wrong';
            toast({
                position: 'bottom-right',
                title: 'Login failed',
                description: errorMessage,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('teal.50', 'teal.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="login">
              <FormLabel>Email Or Username </FormLabel>
              <Input type="text" {...register("login", { required: true })} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <InputGroup size='md'>
                <Input
                  {...register("password", { required: true })}
                  pr='4.5rem'
                  type={show ? 'text' : 'password'}
                  placeholder='Enter password'
                />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox {...register("remember")}>Remember me</Checkbox>
                <ChakraLink  color='teal.500' as={ReactRouterLink} to={FORGOT}>
                  Forgot password?
                </ChakraLink>
              </Stack>
              <Button
                    isLoading={isSubmitting}
                    loadingText="Signing in"
                    type="submit"
                    colorScheme="blue"
                    variant="solid"
                >
                    Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
        </form>
      </Stack>
    </Flex>
  )
}