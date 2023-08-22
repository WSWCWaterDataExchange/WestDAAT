import React, { useEffect, useState, useRef } from 'react';

interface TruncatedTextProps {
  text: string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ text }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClamped, setIsClamped] = useState(true);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const toggleShowFullText = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    let clone: HTMLDivElement | undefined = undefined;
    if(paragraphRef && paragraphRef.current){
      clone = paragraphRef.current.parentElement?.cloneNode(true) as HTMLDivElement || document.createElement('div');
      clone.style.visibility='hidden';
      clone.style.position = 'fixed';
      clone.style.width = `${paragraphRef.current.parentElement?.clientWidth}px`;
      paragraphRef.current.parentElement?.parentElement?.appendChild(clone);
    }
    function handleResize() {
      if (paragraphRef && paragraphRef.current && clone) {
        clone.style.width = `${paragraphRef.current.parentElement?.clientWidth}px`;
        const clientHeight = clone.querySelector('p')?.clientHeight || 0;
        const scrollHeight = clone.querySelector('p')?.scrollHeight || 0;
        paragraphRef.current.style.setProperty('--truncated-height', `${clientHeight}px`)
        paragraphRef.current.style.setProperty('--expanded-height', `${scrollHeight}px`)
        setIsClamped(
          scrollHeight > clientHeight
        )
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize();
    return () => window.removeEventListener('resize', handleResize)
  }, [paragraphRef, setIsClamped, setIsOpen])

  return (
    <div>
      <div className={`paragraph-truncate${isOpen ? ' open' : ''}${isClamped ? ' truncated' : ''}`}>
        <p ref={paragraphRef}>{text}</p>
        <button className='btn btn-link p-0 m-0' onClick={toggleShowFullText}></button>
      </div>
    </div>
  );
};

export default TruncatedText;