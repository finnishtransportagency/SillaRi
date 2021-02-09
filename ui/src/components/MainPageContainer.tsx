import React from 'react';
import { useTranslation } from 'react-i18next';
import './MainPageContainer.css';

interface ContainerProps { }

const MainPageContainer: React.FC<ContainerProps> = () => {

  const { t } = useTranslation();

  return (
    <div className="container">
      <strong>{t('main.title')}</strong>
      <p>{t('main.content')}</p>
    </div>
  );
};

export default MainPageContainer;
