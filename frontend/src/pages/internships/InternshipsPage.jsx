import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { internshipsApi } from '../services/api';
import { Button } from '../components/UI/Button';
import { Card, CardHeader, CardContent, CardTitle } from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    location: '',
    type: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      try {
        const data = await internshipsApi.getListings(filters);
        setInternships(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching internships:', err);
        setError('Дадлагын жагсаалтыг ачааллахад алдаа гарлаа.');
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [filters]);

  const handleViewDetails = (id) => {
    navigate(`/internships/${id}`);
  };

  const handleApply = async (id) => {
    try {
      await internshipsApi.apply(id, {});
      // Refresh internship list after successful application
      const data = await internshipsApi.getListings(filters);
      setInternships(data);
    } catch (error) {
      console.error(`Error applying to internship (ID: ${id}):`, error);
      setError('Дадлагад бүртгүүлэхэд алдаа гарлаа.');
    }
  };

  const handleBookmark = async (id) => {
    try {
      await internshipsApi.bookmark(id);
      // Update UI to show bookmark state has changed
      setInternships(prevInternships => 
        prevInternships.map(internship => 
          internship.id === id 
            ? { ...internship, bookmarked: !internship.bookmarked } 
            : internship
        )
      );
    } catch (error) {
      console.error(`Error bookmarking internship (ID: ${id}):`, error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader title="Дадлагын байрууд" />
        <div className="flex justify-center mt-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Дадлагын байрууд" 
        description="Боломжит бүх дадлагын байрууд"
        extra={
          <Button variant="primary" onClick={() => navigate('/internships/bookmarked')}>
            Хадгалсан дадлагууд
          </Button>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Хайлт
              </label>
              <input
                type="text"
                name="query"
                value={filters.query}
                onChange={handleFilterChange}
                placeholder="Хайх..."
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ангилал
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Бүгд</option>
                <option value="software">Програм хангамж</option>
                <option value="data">Дата шинжилгээ</option>
                <option value="design">Дизайн</option>
                <option value="marketing">Маркетинг</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Байршил
              </label>
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Бүгд</option>
                <option value="ulaanbaatar">Улаанбаатар</option>
                <option value="remote">Зайн</option>
                <option value="hybrid">Холимог</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Төрөл
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Бүгд</option>
                <option value="full-time">Бүтэн цагийн</option>
                <option value="part-time">Хагас цагийн</option>
                <option value="flexible">Уян хатан</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Internship listings */}
      {error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : internships.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Дадлагын байр олдсонгүй
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map(internship => (
            <Card key={internship.id} className="flex flex-col h-full">
              <CardContent>
                <div className="flex items-center mb-4">
                  {internship.logo ? (
                    <img 
                      src={internship.logo} 
                      alt={internship.organization} 
                      className="w-12 h-12 object-contain mr-4"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                      <span className="text-gray-500 text-xl">{internship.organization.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{internship.position}</h3>
                    <p className="text-gray-600">{internship.organization}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {internship.location}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {internship.type}, {internship.duration}
                  </div>
                  
                  {internship.salary && (
                    <div className="flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      {internship.salary}
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-4 flex-grow">
                  {internship.description.length > 150 
                    ? `${internship.description.substring(0, 150)}...` 
                    : internship.description
                  }
                </p>
                
                <div className="flex justify-between mt-auto">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleViewDetails(internship.id)}
                  >
                    Дэлгэрэнгүй
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleBookmark(internship.id)}
                    >
                      {internship.bookmarked ? 'Хадгалсан' : 'Хадгалах'}
                    </Button>
                    
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleApply(internship.id)}
                      disabled={internship.applied}
                    >
                      {internship.applied ? 'Бүртгүүлсэн' : 'Бүртгүүлэх'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternshipsPage; 