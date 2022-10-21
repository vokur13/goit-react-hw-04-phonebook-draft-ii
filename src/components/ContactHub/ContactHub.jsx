import { useState, useMemo, useEffect } from 'react';
import { ContactForm } from 'components/ContactForm';
import { Filter } from 'components/Filter';
import { ContactList } from 'components/ContactList';
import { nanoid } from 'nanoid';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { initailContacts } from 'utils/initialContacts';

const STORAGE_KEY = 'contacts';

export function ContactHub() {
  const [contacts, setContacts] = useLocalStorage(STORAGE_KEY, initailContacts);
  const [filter, setFilter] = useState('');

  useEffect(() => {}, []);

  function onFilterChange({ filter }) {
    !filter ? setFilter('') : setFilter(filter);
  }

  function formSubmitHandler({ name, number }) {
    const checkName = contacts.some(item =>
      item.name.toLowerCase().trim().includes(name.toLowerCase().trim())
    );
    checkName
      ? alert(`${name} is already in contacts`)
      : setContacts([{ id: nanoid(), name, number }, ...contacts]);
  }

  const filteredContacts = useMemo(() => {
    return contacts.filter(item =>
      item.name.toLowerCase().trim().includes(filter.toLowerCase().trim())
    );
  }, [contacts, filter]);

  function deleteItem(itemID) {
    setContacts(contacts.filter(item => item.id !== itemID));
  }

  return (
    <>
      <ContactForm onFormSubmit={formSubmitHandler} />
      <h2>Contacts</h2>
      <Filter onChange={onFilterChange} />
      <ContactList onDelete={deleteItem} list={filteredContacts} />
    </>
  );
}
