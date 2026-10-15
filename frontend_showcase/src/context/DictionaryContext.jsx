import React, { createContext, useContext, useState, useCallback } from 'react';

const DictionaryContext = createContext({
  isOpen: false,
  activeTermId: null,
  openDictionary: () => {},
  closeDictionary: () => {}
});

export function DictionaryProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTermId, setActiveTermId] = useState(null);

  const openDictionary = useCallback((termId = null) => {
    setActiveTermId(termId);
    setIsOpen(true);
  }, []);

  const closeDictionary = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <DictionaryContext.Provider
      value={{
        isOpen,
        activeTermId,
        openDictionary,
        closeDictionary
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return context;
}
