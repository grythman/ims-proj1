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
  icon: Icon,
  colorScheme = 'green'
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

  // Карт дотор IconBackground component
  const IconBackground = () => {
    const colorMap = {
      violet: 'bg-violet-100',
      green: 'bg-green-100',
      blue: 'bg-blue-100',
      amber: 'bg-amber-100',
      purple: 'bg-purple-100',
      red: 'bg-red-100',
    };
    
    const iconColorMap = {
      violet: 'text-violet-600',
      green: 'text-green-600',
      blue: 'text-blue-600',
      amber: 'text-amber-600',
      purple: 'text-purple-600',
      red: 'text-red-600',
    };
    
    const bgColor = colorMap[colorScheme] || colorMap.green;
    const iconColor = iconColorMap[colorScheme] || iconColorMap.green;
    
    return (
      <div className={`rounded-full p-2 ${bgColor}`}>
        {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
      </div>
    );
  };

  return (
    <Card className="p-4 overflow-hidden relative">
      <div className="flex justify-between items-center">
        {/* Icon */}
        {Icon && <IconBackground />}

        {/* Title and value information */}
        <div className="flex flex-col text-right w-full ml-3">
          <h3 className="text-xs font-medium text-gray-500 mb-1">{title}</h3>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
          
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          
          {changeValue && (
            <p className={`text-sm ${getChangeColor()} flex items-center justify-end mt-1`}>
              {getChangePrefix()}{changeValue}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatisticsCard; 