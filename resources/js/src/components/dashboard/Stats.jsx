import { Card, CardHeader, CardBody, CardFooter,
  SimpleGrid,
  Heading,
  Button,
 } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const Stats = () => {
    const { t } = useTranslation();
  return (
    <>
        <SimpleGrid
            spacing={6}
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            >
            {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                <CardHeader>
                    <Heading size="md">Customer dashboard</Heading>
                </CardHeader>
                <CardBody>
                    <Heading size="sm">Stat {i + 1}</Heading>
                </CardBody>
                <CardFooter>
                    <Button colorScheme='teal' size="sm">{t('details')}</Button>
                </CardFooter>
                </Card>
            ))}
        </SimpleGrid>
    </>
  )
}

export default Stats