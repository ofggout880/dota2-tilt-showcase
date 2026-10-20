import React, { createContext, useContext, useState, useCallback } from 'react';

const DictionaryContext = createContext({
  isOpen: false,
  activeTermId: null,
  isAboutOpen: false,
  openDictionary: () => {},
  closeDictionary: () => {},
  openAboutModal: () => {},
  closeAboutModal: () => {}
});

export function DictionaryProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTermId, setActiveTermId] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const openDictionary = useCallback((termId = null) => {
    setActiveTermId(termId);
    setIsOpen(true);
  }, []);

  const closeDictionary = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openAboutModal = useCallback(() => {
    setIsAboutOpen(true);
  }, []);

  const closeAboutModal = useCallback(() => {
    setIsAboutOpen(false);
  }, []);

  return (
    <DictionaryContext.Provider
      value={{
        isOpen,
        activeTermId,
        isAboutOpen,
        openDictionary,
        closeDictionary,
        openAboutModal,
        closeAboutModal
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
