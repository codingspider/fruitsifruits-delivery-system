import { Card, CardHeader, CardBody, CardFooter,
  SimpleGrid,
  Heading,
  Button,
 } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../axios';
import { useCurrencyFormatter } from './../../useCurrencyFormatter';

const DriverStats = () => {
    const { t } = useTranslation();
    const [totalDelivery, setTotalDelivery] = useState(null); 
    const [totalEarning, setTotalEarning] = useState(null); 
    const [totalPending, setTotalPending] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const { formatAmount, currency } = useCurrencyFormatter();

    const DashboardStats = async () => {
        try {
            const res = await api.get("/driver/get/stats");
            setTotalDelivery(res.data.data.total_delivery);
            setTotalEarning(res.data.data.total_amount);
            setTotalPending(res.data.data.total_pending_amount);
        } catch (err) {
            console.error("fetchFlavours error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        DashboardStats();
    }, []);
  return (
    <>
        <SimpleGrid
            spacing={6}
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            >
            <Card>
                <CardHeader>
                    <Heading size="md">{t('total_deliveries')}</Heading>
                </CardHeader>
                <CardBody>
                    <Heading size="sm">{totalDelivery}</Heading>
                </CardBody>
                <CardFooter>
                    <Button colorScheme='teal' size="sm">{t('details')}</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <Heading size="md">{t('total_earning')}</Heading>
                </CardHeader>
                <CardBody>
                    <Heading size="sm">{formatAmount(totalEarning)}</Heading>
                </CardBody>
                <CardFooter>
                    <Button colorScheme='teal' size="sm">{t('details')}</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <Heading size="md">{t('pending_payments')}</Heading>
                </CardHeader>
                <CardBody>
                    <Heading size="sm">{formatAmount(totalPending)}</Heading>
                </CardBody>
                <CardFooter>
                    <Button colorScheme='teal' size="sm">{t('details')}</Button>
                </CardFooter>
            </Card>
            
        </SimpleGrid>
    </>
  )
}

export default DriverStats