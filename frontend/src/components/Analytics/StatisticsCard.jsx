import React from 'react';
import { Card } from '../UI/Card';

/**
 * Статистик мэдээлэл харуулах карт компонент
 * @param {string} title - Картын гарчиг
 * @param {string} value - Харуулах утга
 * @param {string} [description] - Нэмэлт тайлбар текст
 * @param {string} [changeValue] - Өөрчлөлтийн хувь
 * @param {string} [changeType] - Өөрчлөлтийн төрөл (positive, negative, neutral)
 * @param {string} [icon] - Картын дээд хэсэгт харуулах icon
 */
const StatisticsCard = ({ 
  title, 
  value, 
  description,
  changeValue,
  changeType = 'neutral',
  icon: Icon
}) => {
  // Өөрчлөлтийн текстийн өнгийг тодорхойлох
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  // Өөрчлөлтийн тэмдэг
  const getChangePrefix = () => {
    if (!changeValue) return '';
    return changeType === 'positive' ? '+' : 
           changeType === 'negative' ? '-' : '';
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          {Icon && <Icon className="h-5 w-5 text-gray-400" />}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          
          {changeValue && (
            <p className={`text-sm ${getChangeColor()} flex items-center mt-1`}>
              {getChangePrefix()}{changeValue}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatisticsCard; 