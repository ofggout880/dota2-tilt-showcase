import React from 'react';
import { useDictionary } from '../context/DictionaryContext';
import { findDictionaryTerm } from '../data/dictionaryData';

/**
 * Interactive In-Text Glossary Term Component
 * Renders an inline clickable term with subtle hover cues and amber dotted underline.
 * Clicking opens the right slide-over dictionary drawer and scrolls to the definition.
 */
export default function GlossaryTerm({
  termId,
  children,
  className = '',
  title
}) {
  const { openDictionary } = useDictionary();
  const termInfo = findDictionaryTerm(termId);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openDictionary(termId);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      openDictionary(termId);
    }
  };

  const displayTitle = title || (termInfo ? `Dictionnaire : ${termInfo.termFr}` : 'Voir la définition dans le dictionnaire');

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`glossary-term ${className}`}
      title={displayTitle}
      data-term-id={termId}
    >
      <span className="glossary-term-text">{children}</span>
      <span className="glossary-term-sparkle" aria-hidden="true">✦</span>
    </span>
  );
}
