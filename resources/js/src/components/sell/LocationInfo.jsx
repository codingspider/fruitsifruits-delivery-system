import React from "react";
import {
    CardBody as ChakraCardBody,
    Card as ChakraCard,
    CardHeader as ChakraCardHeader,
    SimpleGrid,
    Text,
    Card,
    CardBody
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const LocationInfo = () => {
    const { t } = useTranslation(); 
    return (
        <>
            <SimpleGrid columns={{ base: 1, md: 1 }} mb={5} spacing={6}>
            <Card>
                <CardBody>
                    <Text fontSize='lg'>Location Name </Text>
                </CardBody>
            </Card>
            </SimpleGrid>
        </>
    );
};

export default LocationInfo;
