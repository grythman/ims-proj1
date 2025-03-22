import React from 'react';
import { Card } from '../UI/Card';
import { Divider } from 'antd';
import { CheckSquare, Edit, List, Clock, FileText } from 'lucide-react';

const ReportTemplate = ({ type }) => {
  const getTemplate = () => {
    switch (type) {
      case 'weekly':
        return {
          title: 'Долоо хоногийн тайлан',
          description: 'Долоо хоног бүрийн дадлагын үйл ажиллагааны тайлан',
          sections: [
            {
              title: 'Гүйцэтгэсэн ажлууд',
              description: 'Энэ долоо хоногт гүйцэтгэсэн гол ажлуудаа жагсаана уу',
              type: 'list'
            },
            {
              title: 'Сурсан чадварууд',
              description: 'Ямар шинэ чадвар, мэдлэг олж авсан бэ?',
              type: 'text'
            },
            {
              title: 'Бэрхшээлүүд',
              description: 'Ямар бэрхшээлтэй тулгарч, хэрхэн шийдвэрлэсэн бэ?',
              type: 'text'
            },
            {
              title: 'Дараагийн долоо хоногийн зорилтууд',
              description: 'Дараагийн долоо хоногт юу хийхээр төлөвлөж байна?',
              type: 'list'
            }
          ]
        };
      case 'monthly':
        return {
          title: 'Сарын тайлан',
          description: 'Сар бүрийн дадлагын дэлгэрэнгүй тайлан',
          sections: [
            {
              title: 'Гол амжилтууд',
              description: 'Энэ сард хүрсэн гол амжилтуудаа жагсаана уу',
              type: 'list'
            },
            {
              title: 'Төслийн явц',
              description: 'Оролцож буй төслүүдийн явцын талаар дэлгэрэнгүй бичнэ үү',
              type: 'text'
            },
            {
              title: 'Чадварын хөгжил',
              description: 'Таны чадварууд энэ сард хэрхэн сайжирсан бэ?',
              type: 'text'
            },
            {
              title: 'Санал, сайжруулалт',
              description: 'Ямар санал хүлээн авсан, хэрхэн сайжрах вэ?',
              type: 'text'
            },
            {
              title: 'Дараа сарын зорилтууд',
              description: 'Дараа сарын зорилтуудаа жагсаана уу',
              type: 'list'
            }
          ]
        };
      case 'final':
        return {
          title: 'Эцсийн тайлан',
          description: 'Дадлагын бүх хугацааны дүгнэлт, үр дүнгийн тайлан',
          sections: [
            {
              title: 'Дадлагын тойм',
              description: 'Дадлагын туршлагын талаар товч дүгнэлт хийнэ үү',
              type: 'text'
            },
            {
              title: 'Гол төслүүд',
              description: 'Ажилласан гол төслүүдийн талаар дэлгэрэнгүй бичнэ үү',
              type: 'list'
            },
            {
              title: 'Олж авсан чадварууд',
              description: 'Ямар чадвар, мэдлэг олж авсан бэ?',
              type: 'list'
            },
            {
              title: 'Бэрхшээл ба шийдлүүд',
              description: 'Тулгарсан гол бэрхшээлүүд болон тэдгээрийг хэрхэн даван туулсан',
              type: 'text'
            },
            {
              title: 'Мэргэжлийн өсөлт',
              description: 'Энэхүү дадлага таны мэргэжлийн хөгжилд хэрхэн нөлөөлсөн бэ?',
              type: 'text'
            },
            {
              title: 'Ирээдүйн төлөвлөгөө',
              description: 'Сурсан зүйлээ ирээдүйн карьертаа хэрхэн ашиглах вэ?',
              type: 'text'
            }
          ]
        };
      default:
        return { title: '', description: '', sections: [] };
    }
  };

  const template = getTemplate();
  const getSectionIcon = (type) => {
    switch(type) {
      case 'list':
        return <List className="h-5 w-5 text-blue-500" />;
      case 'text':
        return <Edit className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="bg-white shadow-sm overflow-hidden">
      <div className="bg-blue-50 p-4 border-b border-blue-100">
        <h3 className="text-lg font-medium text-blue-800">
          {template.title}
        </h3>
        <p className="mt-1 text-sm text-blue-600">
          {template.description}
        </p>
      </div>
      
      <div className="p-4">
        <div className="space-y-6">
          {template.sections.map((section, index) => (
            <div key={index} className={index > 0 ? "pt-4 border-t border-gray-100" : ""}>
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  {getSectionIcon(section.type)}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-900 flex items-center">
                    {section.title}
                    {section.type === 'list' && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        Жагсаалт
                      </span>
                    )}
                    {section.type === 'text' && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        Текст
                      </span>
                    )}
                  </h4>
                  
                  <p className="mt-1 text-sm text-gray-500">
                    {section.description}
                  </p>
                  
                  {section.type === 'list' ? (
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li className="text-gray-400 italic">
                        <span className="text-gray-600">• Жагсаалтын зүйл #1</span>
                      </li>
                      <li className="text-gray-400 italic">
                        <span className="text-gray-600">• Жагсаалтын зүйл #2</span>
                      </li>
                      <li className="text-gray-400 italic">
                        <span className="text-gray-600">• Жагсаалтын зүйл #3</span>
                      </li>
                    </ul>
                  ) : (
                    <div className="mt-2 text-sm text-gray-600 italic bg-gray-50 p-3 rounded border border-gray-100">
                      Энд текст бичнэ...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>Тайлан бөглөх зөвлөмж: Тайлангаа тайлант хугацаа дууссанаас хойш 3 хоногийн дотор илгээнэ үү</span>
        </div>
      </div>
    </Card>
  );
};

export default ReportTemplate; 