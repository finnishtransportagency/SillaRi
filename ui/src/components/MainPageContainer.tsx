import React from 'react';
import { useTranslation } from 'react-i18next';
import './MainPageContainer.css';

const MainPageContainer: React.FC = () => {

  const { t } = useTranslation();

  return (
    <div className="container">
      <strong>{t('main.title')}</strong>
      <p>{t('main.content')}</p>
    </div>
  );
};

export default MainPageContainer;
