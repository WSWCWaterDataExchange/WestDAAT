import React, { useState } from 'react';

interface TruncatedTextProps {
  text: string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ text }) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <div>
      {showFullText ? (
        <>
          <p>{text}</p>
          <span
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={toggleShowFullText}
          >
            {' '}
            View less
          </span>
        </>
      ) : (
        <>
          <p>
            <div className='paragraph-truncate'>
                {   text}
            </div>
            
            <span
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={toggleShowFullText}
            >
              {' '}
              View more
            </span>
          </p>
        </>
      )}
    </div>
  );
};

export default TruncatedText;