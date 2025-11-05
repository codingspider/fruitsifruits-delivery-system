import React, { useEffect, useState } from "react";
import {
    Box,
    Flex,
    Text,
    Button,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    useToast
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import api from "../../axios";
import { useForm } from "react-hook-form";

const PreviousDue = () => {
    const bg = useColorModeValue("white", "gray.800");
    const border = useColorModeValue("gray.200", "gray.700");
    const { t } = useTranslation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dues, setDues] = useState([]);
    const [selectedDue, setSelectedDue] = useState(null);
    const { register, handleSubmit, reset } = useForm();
    const toast = useToast();


    const getPreviousDue = async () => {
        try {
            const res = await api.get("driver/get/previous/due");
            setDues(res.data.data);
        } catch (err) {
            console.error("Error fetching dues:", err);
        }
    };

    useEffect(() => {
        getPreviousDue();
    }, []);

    // ✅ handle button click
    const handleOpenModal = (due) => {
        setSelectedDue(due);
        onOpen();
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const res = await api.post(`driver/make/payment`, data);
            toast({
                position: "bottom-right",
                title: res.data.message,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onClose();
        } catch (err) {
            const errorResponse = err?.response?.data;
            if (errorResponse?.errors) {
                const errorMessage = Object.values(errorResponse.errors)
                    .flat()
                    .join(" ");
                toast({
                    position: "bottom-right",
                    title: "Error",
                    description: errorMessage,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } else if (errorResponse?.message) {
                toast({
                    position: "bottom-right",
                    title: "Error",
                    description: errorResponse.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } finally {
            setIsSubmitting(false);
            onClose();
            getPreviousDue();
        }
    };

    return (
        <>
            {dues.map((due) => (
                <Box
                    key={due.id}
                    bg={bg}
                    borderWidth="1px"
                    borderColor={border}
                    borderRadius="lg"
                    p={4}
                    boxShadow="md"
                    mx="auto"
                    mb={5}
                >
                    <Flex align="center" justify="space-between" gap={4}>
                        {/* Left Side Content */}
                        <Box>
                            <Text fontSize="lg" fontWeight="bold">
                                {due.reference_no || "Unknown Driver"}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                {t("due_amount")}: {due.total_amount}
                            </Text>
                        </Box>

                        {/* Right Side Button */}
                        <Button
                            colorScheme="blue"
                            onClick={() => handleOpenModal(due)}
                            flexShrink={0}
                        >
                            {t("add_payment")}
                        </Button>
                    </Flex>
                </Box>
            ))}

            {/* ✅ Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalContent>
                        <ModalHeader>{t("payment_details")}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {selectedDue ? (
                                <>
                                    <Text>
                                        <strong>{t("ref_no")}:</strong>{" "}
                                        {selectedDue.reference_no}
                                    </Text>
                                    <Text>
                                        <strong>{t("due_amount")}:</strong>{" "}
                                        {selectedDue.total_amount}
                                    </Text>
                                    <Input
                                        type="hidden"
                                        {...register("transaction_id", {
                                            required: true,
                                        })}
                                        value={selectedDue.id}
                                    ></Input>
                                    <Text color="tomato">Once you submit, the due amount will be settled.</Text>
                                </>
                            ) : (
                                <Text>{t("no_data_found")}</Text>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                colorScheme="blue"
                                size="sm"
                                mr={3}
                                onClick={onClose}
                            >
                                {t("close")}
                            </Button>
                            <Button
                                size="sm"
                                type="submit"
                                isLoading={isSubmitting}
                                loadingText="Saving Data..."
                                colorScheme="teal"
                            >
                                {t("pay_now")}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </>
    );
};

export default PreviousDue;
