import React from 'react';
import clsx from 'clsx';

/**
 * Хуудасны гарчиг компонент
 * @param {string} title - Хуудасны үндсэн гарчиг
 * @param {string} subtitle - Нэмэлт тайлбар текст
 * @param {React.ReactNode} [extra] - Нэмэлт элементүүд (товчлуур, линк, гм.)
 * @param {boolean} [withBorder] - Доод хэсэгт хүрээний зураас гаргах
 * @param {boolean} [centerAlign] - Текстийг төвд байрлуулах
 */
const PageHeader = ({ 
  title, 
  subtitle, 
  extra, 
  withBorder = false,
  centerAlign = false,
  className
}) => {
  return (
    <div 
      className={clsx(
        'mb-8 flex flex-col space-y-3',
        centerAlign ? 'items-center text-center' : 'items-start',
        withBorder && 'pb-6 border-b border-gray-200',
        className,
        'md:flex-row md:space-y-0 md:justify-between'
      )}
    >
      <div className={clsx('max-w-3xl', centerAlign && 'text-center')}>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-lg text-gray-500">{subtitle}</p>
        )}
      </div>
      {extra && (
        <div className={clsx(
          'flex',
          centerAlign ? 'justify-center' : 'justify-start md:justify-end',
          'mt-4 md:mt-0 shrink-0'
        )}>
          {extra}
        </div>
      )}
    </div>
  );
};

export default PageHeader; 