'use client'
import React, { useState } from 'react';
import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  FormLabel,
  InputRightElement,
  InputGroup,
} from '@chakra-ui/react'
import { useForm } from "react-hook-form";
import { resettPassword } from '../../services/authService';
import { useParams, useNavigate } from 'react-router-dom';
import { LOGIN } from '../../router';


export default function ResetPassword() {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    const { reset_token } = useParams();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const { email, password, token } = data;
        try {
            const res = await resettPassword(email, password, token);
            reset();
            toast({
                position: 'bottom-right',
                title: 'Password Reset',
                description: res.message,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            navigate(`${LOGIN}`);

        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || 'Something went wrong';
            reset();
            toast({
                position: 'bottom-right',
                title: 'Password Reset failed',
                description: errorMessage,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('teal.50', 'teal.800')}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Enter new password
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
           {...register("email", { required: true, maxLength: 20, email:true })}
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
          />
        </FormControl>
        <FormControl id="token" isRequired>
          <Input
          {...register("token", { required: true})}
          value={reset_token}
          type="hidden"
          />
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
        <Stack spacing={6} mt={4}>
          <Button
            isLoading={isSubmitting}
            loadingText="Resetting password.."
            type='submit'
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}>
            Submit
          </Button>
        </Stack>
        </form>
      </Stack>
    </Flex>
  )
}