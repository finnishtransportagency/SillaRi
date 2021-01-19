import React from 'react';
import './MainPageContainer.css';

interface ContainerProps { }

const MainPageContainer: React.FC<ContainerProps> = () => {
  return (
    <div className="container">
      <strong>SillaRi</strong>
      <p>Pääsivun sisältöä tähän.</p>
    </div>
  );
};

export default MainPageContainer;
