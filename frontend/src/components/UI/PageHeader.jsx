import React from 'react';

/**
 * Хуудасны гарчиг компонент
 * @param {string} title - Хуудасны үндсэн гарчиг
 * @param {string} subtitle - Нэмэлт тайлбар текст
 * @param {React.ReactNode} [extra] - Нэмэлт элементүүд (товчлуур, линк, гм.)
 */
const PageHeader = ({ title, subtitle, extra }) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {extra && (
        <div className="mt-4 md:mt-0">{extra}</div>
      )}
    </div>
  );
};

export default PageHeader; 