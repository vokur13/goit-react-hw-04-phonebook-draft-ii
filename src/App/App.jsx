import { Box } from 'components/Box';
import { ContactHub } from 'components/ContactHub';

export const App = () => {
  return (
    <Box width={1} p={4} bg="bgBasic" as="main">
      <h1>Phonebook</h1>
      <ContactHub />
    </Box>
  );
};
