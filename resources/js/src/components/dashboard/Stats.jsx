import { Card, CardHeader, CardBody, CardFooter,
  SimpleGrid,
  Heading,
  Button,
 } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../axios';
import { useCurrencyFormatter } from '../../useCurrencyFormatter';

const Stats = () => {
    const { t } = useTranslation();
    const [monthlProduction, setMonthlyProduction] = useState(null); 
    const [totalDelivered, setTotalDelivered] = useState(null); 
    const [totalCollection, setTotalCollection] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const { formatAmount, currency } = useCurrencyFormatter();

    const DashboardStats = async () => {
        try {
            const res = await api.get("/superadmin/get/stats");
            setMonthlyProduction(res.data.data.monthly_production);
            setTotalDelivered(res.data.data.total_delivered);
            setTotalCollection(res.data.data.total_collection);
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
                    <Heading size="md">{t('monthly_production')}</Heading>
                </CardHeader>
                <CardBody>
                    <Heading size="sm">{monthlProduction}</Heading>
                </CardBody>
                <CardFooter>
                    <Button colorScheme='teal' size="sm">{t('details')}</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <Heading size="md">{t('to_be_delivered')}</Heading>
                </CardHeader>
                <CardBody>
                    <Heading size="sm">Stat </Heading>
                </CardBody>
                <CardFooter>
                    <Button colorScheme='teal' size="sm">{t('details')}</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <Heading size="md">{t('total_delivered')}</Heading>
                </CardHeader>
                <CardBody>
                    <Heading size="sm">{totalDelivered}</Heading>
                </CardBody>
                <CardFooter>
                    <Button colorScheme='teal' size="sm">{t('details')}</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <Heading size="md">{t('pending_orders')}</Heading>
                </CardHeader>
                <CardBody>
                    <Heading size="sm">Stat </Heading>
                </CardBody>
                <CardFooter>
                    <Button colorScheme='teal' size="sm">{t('details')}</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <Heading size="md">{t('total_collection')}</Heading>
                </CardHeader>
                <CardBody>
                    <Heading size="sm">{formatAmount(totalCollection)}</Heading>
                </CardBody>
                <CardFooter>
                    <Button colorScheme='teal' size="sm">{t('details')}</Button>
                </CardFooter>
            </Card>
        </SimpleGrid>
    </>
  )
}

export default Stats