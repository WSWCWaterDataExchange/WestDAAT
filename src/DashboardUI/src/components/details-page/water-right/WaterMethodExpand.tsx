import React, { useState } from 'react';

interface TextTruncateProps {
  text: string;
  maxLength: number;
}

const TextTruncate: React.FC<TextTruncateProps> = ({ text, maxLength }) => {
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
            {text.length > maxLength ? text.slice(0, maxLength) + '...' : text}
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

export default TextTruncate;