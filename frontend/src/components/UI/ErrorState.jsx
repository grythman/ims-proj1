import React from 'react';
import { Result, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

const ErrorState = ({ 
  title = "Сүлжээний алдаа", 
  subTitle = "Сервертэй холбогдоход алдаа гарлаа. Дахин оролдоно уу.", 
  onRetry,
  showReturnButton = true,
  showRetryButton = true 
}) => {
  const navigate = useNavigate();

  return (
    <Result
      status="error"
      title={title}
      subTitle={subTitle}
      icon={<AlertTriangle size={64} className="text-red-500" />}
      extra={
        <Space>
          {showRetryButton && onRetry && (
            <Button 
              type="primary" 
              onClick={onRetry}
              icon={<RefreshCw size={16} />}
              className="bg-green-600 hover:bg-green-700"
            >
              Дахин оролдох
            </Button>
          )}
          {showReturnButton && (
            <Button 
              type="default" 
              onClick={() => navigate('/dashboard')}
              icon={<Home size={16} />}
            >
              Хянах самбар руу буцах
            </Button>
          )}
        </Space>
      }
    />
  );
};

export default ErrorState; 