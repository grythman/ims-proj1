import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Input, Select, message } from 'antd';
import { Search, Filter, Eye, FileText, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Option } = Select;

const MentorStudents = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/mentor/students/', {
        params: {
          search: searchTerm || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined
        }
      });
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('Оюутнуудын мэдээлэл ачаалахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchStudents();
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    fetchStudents();
  };

  const getStatusTag = (status) => {
    const statusMap = {
      active: { color: 'green', text: 'Идэвхтэй' },
      completed: { color: 'blue', text: 'Дууссан' },
      pending: { color: 'orange', text: 'Хүлээгдэж буй' }
    };
    
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: 'Оюутан',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.student_id}</div>
        </div>
      ),
    },
    {
      title: 'Мэргэжил',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: 'Дадлагын төрөл',
      dataIndex: 'internship_type',
      key: 'internship_type',
    },
    {
      title: 'Төлөв',
      dataIndex: 'status',
      key: 'status',
      render: status => getStatusTag(status),
    },
    {
      title: 'Үйлдэл',
      key: 'action',
      render: (_, record) => (
        <div className="space-x-2">
          <Button
            type="text"
            icon={<Eye className="h-4 w-4" />}
            onClick={() => navigate(`/mentor/students/${record.id}`)}
          >
            Дэлгэрэнгүй
          </Button>
          <Button
            type="text"
            icon={<FileText className="h-4 w-4" />}
            onClick={() => navigate(`/mentor/students/${record.id}/reports`)}
          >
            Тайлан
          </Button>
          <Button
            type="text"
            icon={<MessageSquare className="h-4 w-4" />}
            onClick={() => navigate(`/mentor/chat?student=${record.id}`)}
          >
            Чат
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Миний оюутнууд</h1>
        <p className="mt-1 text-sm text-gray-500">
          Таны удирдлага дор дадлага хийж буй оюутнуудын жагсаалт
        </p>
      </div>

      <Card>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-xs">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                placeholder="Хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onPressEnter={handleSearch}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <Select
                value={statusFilter}
                onChange={handleStatusFilter}
                style={{ width: 150 }}
              >
                <Option value="all">Бүх төлөв</Option>
                <Option value="active">Идэвхтэй</Option>
                <Option value="completed">Дууссан</Option>
                <Option value="pending">Хүлээгдэж буй</Option>
              </Select>
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={students}
          rowKey="id"
          loading={loading}
          pagination={{
            total: students.length,
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => `Нийт ${total} оюутан`
          }}
        />
      </Card>
    </div>
  );
};

export default MentorStudents; 