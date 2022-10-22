import { useState, useMemo, useEffect, useReducer, useRef } from 'react';
import { ContactForm } from 'components/ContactForm';
import { Filter } from 'components/Filter';
import { ContactList } from 'components/ContactList';
import { nanoid } from 'nanoid';
import { save, load } from '../../utils/storage';
// import { useLocalStorage } from '../../hooks/useLocalStorage';
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
    default:
      throw new Error(`Unsupported action action type ${action.type}`);
  }
}

function init(initialState) {
  return {
    ...initialState,
    contacts: [...initialState.contacts, ...initailContacts],
  };
}

export function ContactHub() {
  const isFirstRender = useRef(true);
  const initialState = {
    //     contacts: useLocalStorage(STORAGE_KEY, initailContacts),
    contacts: load(STORAGE_KEY) ? load(STORAGE_KEY) : [],
    filter: '',
  };

  const [state, dispatch] = useReducer(setReducer, initialState, init);
  const [filter, setFilter] = useState('');

  function onFilterChange(value) {
    !value ? setFilter('') : setFilter(value);
  }

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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    //     save(STORAGE_KEY, state.contacts);
  }, [state.contacts]);

  const filteredContacts = useMemo(() => {
    return state.contacts.filter(item =>
      item.name.toLowerCase().trim().includes(filter.toLowerCase().trim())
    );
  }, [filter, state.contacts]);

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
