import { useState, useMemo, useEffect, useReducer } from 'react';
import { ContactForm } from 'components/ContactForm';
import { Filter } from 'components/Filter';
import { ContactList } from 'components/ContactList';
import { nanoid } from 'nanoid';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { initailContacts } from 'utils/initialContacts';

const STORAGE_KEY = 'contacts';

function setReducer(state, action) {
  switch (action.type) {
    case 'formSubmitHandler':
      return {
        ...state,
        contacts: [action.payload, ...state.contacts],
      };
    case 'deleteItem':
      return {
        ...state,
        contacts: state.contacts.filter(item => item.id !== action.payload),
      };
    case 'onFilterChange':
      return { ...state, filter: action.payload };
    //   !filter ? setFilter('') : setFilter(filter);
    default:
      throw new Error(`Unsupported action action type ${action.type}`);
  }
}

export function ContactHub() {
  //   const initialValue = {
  //     contacts: useLocalStorage(STORAGE_KEY, initailContacts),
  //     filter: '',
  //   };

  const [state, dispatch] = useReducer(setReducer, {
    //     contacts: useLocalStorage(STORAGE_KEY, initailContacts),
    contacts: [],
    filter: '',
  });

  //     const [contacts, setContacts] = useLocalStorage(STORAGE_KEY, initailContacts);
  //   const [filter, setFilter] = useState('');

  function onFilterChange({ filter }) {
    //     !filter ? setFilter('') : setFilter(filter);
    dispatch({ type: 'onFilterChange', payload: filter });
  }

  //   function onFilterChange({ value }) {
  //     dispatch({ type: 'filter', payload: value });
  //   }

  function formSubmitHandler({ name, number }) {
    const checkName = state.contacts.some(item =>
      item.name.toLowerCase().trim().includes(name.toLowerCase().trim())
    );
    checkName
      ? alert(`${name} is already in contacts`)
      : dispatch({
          type: 'formSubmitHandler',
          payload: { id: nanoid(), name, number },
        });
  }

  const filteredContacts = useMemo(() => {
    return state.contacts.filter(item =>
      item.name.toLowerCase().trim().includes(state.filter.toLowerCase().trim())
    );
  }, [state.filter, state.contacts]);

  function deleteItem(itemID) {
    dispatch({ type: 'deleteItem', payload: itemID });
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
