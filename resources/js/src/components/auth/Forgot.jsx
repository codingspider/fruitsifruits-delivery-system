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
  useToast
} from '@chakra-ui/react'
import { useForm } from "react-hook-form";
import { forgotPassword } from '../../services/authService';


export default function Forgot() {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, reset } = useForm()
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const { email } = data;
        try {
            const res = await forgotPassword(email);
            console.log(res);
            reset();
            toast({
                position: 'bottom-right',
                title: 'Email sent successfully!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || 'Something went wrong';
            reset();
            toast({
                position: 'bottom-right',
                title: 'Email sending failed',
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
          Forgot your password?
        </Heading>
        <Text
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}>
          You&apos;ll get an email with a reset link
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="email">
          <Input
           {...register("email", { required: true, maxLength: 20, email:true })}
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
          />
        </FormControl>
        <Stack spacing={6} mt={4}>
          <Button
            isLoading={isSubmitting}
            loadingText="Sending email.."
            type='submit'
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}>
            Request Reset
          </Button>
        </Stack>
        </form>
      </Stack>
    </Flex>
  )
}