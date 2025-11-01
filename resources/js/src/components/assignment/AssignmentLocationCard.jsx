import { Card, CardBody, Heading, Stack, Text } from "@chakra-ui/react";

const AssignmentLocationCard = ({ location, route_location, t }) => (
  <Card mb={6}>
    <CardBody>
      <Heading textAlign="center">{location?.name}</Heading>
      <Stack spacing={2} textAlign="center" mt={4}>
        <Text><strong>{t('assigned_date')}:</strong> {route_location.created_at ? new Date(route_location.created_at).toLocaleDateString() : "—"}</Text>
        <Text><strong>{t('day_of_week')}:</strong> {route_location.day ? new Date(route_location.created_at).toLocaleDateString(undefined, { weekday: "long" }) : "—"}</Text>
        <Text><strong>{t('status')}:</strong> <Text as="span" color="orange.500">{route_location.status}</Text></Text>
      </Stack>
    </CardBody>
  </Card>
);

export default AssignmentLocationCard;
