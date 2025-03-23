import React, { useState, useEffect } from 'react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { FileEdit, Calendar, User, Building, CheckSquare, Clock, Award, Star, FileText, UserRound, GraduationCap, ChevronRight, BookText, PresentationIcon, Search, MapPin, Briefcase, Bookmark, Share2, Filter, Sliders } from 'lucide-react';
import { Tag, Progress, Skeleton, Tooltip, Badge, Input, Select, Empty, Divider, Slider, Checkbox, Rate, notification } from 'antd';
import api from '../../services/api';
import ErrorState from '../../components/UI/ErrorState';
import StatisticsCard from '../../components/Analytics/StatisticsCard';
import { motion } from 'framer-motion';

const InternshipListings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internshipData, setInternshipData] = useState(null);
  const [activeInternship, setActiveInternship] = useState(null);
  const [internshipListings, setInternshipListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [salaryRange, setSalaryRange] = useState([0, 2000000]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [bookmarkedListings, setBookmarkedListings] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Идэвхтэй дадлагын мэдээлэл авах
        try {
          console.log('Идэвхтэй дадлагын мэдээлэл авч байна...');
          const internshipResponse = await api.get('/api/v1/internships/my-internship/');
          console.log('Идэвхтэй дадлага:', internshipResponse.data);
        setInternshipData(internshipResponse.data);
        setActiveInternship(internshipResponse.data);
        } catch (internshipError) {
          console.warn('Идэвхтэй дадлагын мэдээлэл авахад алдаа гарлаа:', internshipError);
          // Идэвхтэй дадлагын мэдээлэл авах боломжгүй байсан ч үргэлжлүүлэх
          setInternshipData(null);
        }
        
        // Дадлагын зарууд авах - зөв endpoint-тэй болгож байна
        console.log('Дадлагын жагсаалт авч байна...');
        const listingsResponse = await api.get('/api/v1/internships/listings/');
        console.log('Дадлагын жагсаалт:', listingsResponse.data);
        setInternshipListings(Array.isArray(listingsResponse.data) ? listingsResponse.data : []);
      } catch (error) {
        console.error('Мэдээлэл авахад алдаа гарлаа:', error);
        setError('Мэдээлэл авахад алдаа гарлаа');
        
        // Туршилтын дадлагын мэдээлэл
        setInternshipData({
          status: 'active',
          organization: 'Монгол Апп ХХК',
          position: 'Веб хөгжүүлэгч',
          mentor: 'Батбаяр Дорж',
          mentorPosition: 'Ахлах хөгжүүлэгч',
          teacher: 'Б. Баярхүү',
          teacherDepartment: 'Програм хангамж, Мэдээллийн системийн тэнхим',
          startDate: '2023-02-15',
          endDate: '2023-05-15',
          totalHours: 240,
          completedHours: 120,
          daysRemaining: 45,
          totalDays: 90,
          completedDays: 45,
          progressPercent: 68,
          credits: 3,
          mentorRating: 4.2,
          teacherRating: 'B+',
          tasksCompleted: 8,
          totalTasks: 12,
          reportsSubmitted: 2,
          totalReports: 3,
          attachments: [
            { id: 1, name: 'Дадлагын гэрээ', url: '#', type: 'pdf' },
            { id: 2, name: 'Байгууллагын танилцуулга', url: '#', type: 'pdf' },
            { id: 3, name: 'Хөтөлбөрийн удирдамж', url: '#', type: 'docx' }
          ],
          nextDeadline: {
            title: 'Эцсийн тайлан илгээх',
            date: '2023-05-10',
            daysLeft: 15
          }
        });
        
        // Туршилтын дадлагын зарууд
        setInternshipListings([
          {
            id: 1,
            organization: 'Монгол Апп ХХК',
            position: 'Веб хөгжүүлэгч',
            location: 'Улаанбаатар',
            type: 'Бүтэн цагийн',
            duration: '3 сар',
            salary: '1,500,000₮',
            category: 'Програм хангамж',
            description: 'React, NodeJS ашиглан веб аппликейшн хөгжүүлэх дадлага. Тогтмол үнэлгээтэй.',
            requirements: ['React эсвэл Angular', 'JavaScript/TypeScript', 'HTML/CSS', 'Git'],
            benefits: ['Цалинтай', 'Ажилд орох боломж', 'Mentor дагалдуулах', 'Уян хатан цаг'],
            applyDeadline: '2023-06-30',
            postedDate: '2023-06-01',
            logo: 'https://via.placeholder.com/80',
            featured: true
          },
          {
            id: 2,
            organization: 'Дата Аналитикс ХХК',
            position: 'Дата аналист',
            location: 'Улаанбаатар',
            type: 'Хагас цагийн',
            duration: '4 сар',
            salary: 'Сарын 800,000₮',
            category: 'Дата шинжилгээ',
            description: 'Бодит дата дээр ажиллаж, шинжилгээ хийх, дата визуалчлал бэлтгэх дадлага.',
            requirements: ['Python/R', 'SQL', 'Статистик мэдлэг', 'Excel/PowerBI'],
            benefits: ['Цалинтай', 'Мэргэжлийн хөгжил', 'Бодит төслүүд', 'Гэрчилгээ'],
            applyDeadline: '2023-07-15',
            postedDate: '2023-06-05',
            logo: 'https://via.placeholder.com/80',
            featured: false
          },
          {
            id: 3,
            organization: 'Fintech Solutions',
            position: 'Mobile Developer',
            location: 'Улаанбаатар',
            type: 'Бүтэн цагийн',
            duration: '6 сар',
            salary: 'Сарын 1,800,000₮',
            category: 'Програм хангамж',
            description: 'Fintech компанид Flutter ашиглан мобайл апп хөгжүүлэх туршлага.',
            requirements: ['Flutter/React Native', 'Dart/JavaScript', 'Mobile app development', 'UI/UX'],
            benefits: ['Өндөр цалин', 'Ажилд орох боломж', 'Олон улсын туршлага', 'Үнэ төлбөргүй хоол'],
            applyDeadline: '2023-07-30',
            postedDate: '2023-06-10',
            logo: 'https://via.placeholder.com/80',
            featured: true
          },
          {
            id: 4,
            organization: 'Дижитал Маркетинг ХХК',
            position: 'Дижитал маркетингийн туслах',
            location: 'Улаанбаатар',
            type: 'Хагас цагийн',
            duration: '3 сар',
            salary: 'Үнэ төлбөргүй',
            category: 'Маркетинг',
            description: 'Сошиал медиа, SEO, контент маркетинг зэрэг чиглэлээр дадлага хийх.',
            requirements: ['Маркетингийн үндэс', 'Сошиал медиа ойлголт', 'Креатив сэтгэлгээ', 'Photoshop/Canva'],
            benefits: ['Туршлага', 'Гэрчилгээ', 'Нетворкинг', 'Уян хатан цаг'],
            applyDeadline: '2023-06-25',
            postedDate: '2023-06-02',
            logo: 'https://via.placeholder.com/80',
            featured: false
          },
          {
            id: 5,
            organization: 'IT Security Solutions',
            position: 'Мэдээллийн аюулгүй байдлын шинжээч',
            location: 'Улаанбаатар',
            type: 'Бүтэн цагийн',
            duration: '4 сар',
            salary: 'Сарын 1,200,000₮',
            category: 'Кибер аюулгүй байдал',
            description: 'Мэдээллийн аюулгүй байдлын шалгалт, аудит, эмзэг байдлын үнэлгээ хийх.',
            requirements: ['Network Security', 'Linux', 'Penetration Testing', 'OWASP'],
            benefits: ['Мэргэжлийн сертификат', 'Олон улсын туршлага', 'Бодит төслүүд', 'Цалинтай'],
            applyDeadline: '2023-07-20',
            postedDate: '2023-06-15',
            logo: 'https://via.placeholder.com/80',
            featured: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (value) => {
    setFilterCategory(value);
  };

  const handleTypeChange = (type) => {
    if(selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(item => item !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterCategory('all');
    setSalaryRange([0, 2000000]);
    setSelectedTypes([]);
  };

  const filteredInternships = internshipListings.filter(listing => {
    const matchesSearch = 
      listing.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || listing.category === filterCategory;
    
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(listing.type);
    
    const matchesSalary = listing.salary === 'Үнэ төлбөргүй' || 
      (parseFloat(listing.salary.replace(/[^0-9]/g, '')) >= salaryRange[0] && 
       parseFloat(listing.salary.replace(/[^0-9]/g, '')) <= salaryRange[1]);
    
    return matchesSearch && matchesCategory && matchesType && matchesSalary;
  });

  const handleBookmark = (id) => {
    if (bookmarkedListings.includes(id)) {
      setBookmarkedListings(bookmarkedListings.filter(item => item !== id));
      notification.success({
        message: 'Амжилттай',
        description: 'Дадлага хадгалагдсанаас хасагдлаа',
        placement: 'bottomRight'
      });
    } else {
      setBookmarkedListings([...bookmarkedListings, id]);
      notification.success({
        message: 'Амжилттай',
        description: 'Дадлага амжилттай хадгалагдлаа',
        placement: 'bottomRight'
      });
    }
  };

  const handleApply = (id) => {
    notification.info({
      message: 'Мэдэгдэл',
      description: 'Дадлагын хүсэлт илгээгдэж байна...',
      placement: 'bottomRight'
    });
    
    // API руу хүсэлт илгээх
    setTimeout(() => {
      notification.success({
        message: 'Амжилттай',
        description: 'Таны дадлагын хүсэлт амжилттай илгээгдлээ!',
        placement: 'bottomRight'
      });
    }, 1500);
  };

  const getStatusTag = (status) => {
    switch(status) {
      case 'active':
        return <Tag color="success">Идэвхтэй</Tag>;
      case 'pending':
        return <Tag color="warning">Хүлээгдэж буй</Tag>;
      case 'completed':
        return <Tag color="blue">Дууссан</Tag>;
      case 'canceled':
        return <Tag color="error">Цуцлагдсан</Tag>;
      default:
        return <Tag>Тодорхойгүй</Tag>;
    }
  };

  const getAttachmentIcon = (type) => {
    switch(type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'xlsx':
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton active paragraph={{ rows: 6 }} />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} active paragraph={{ rows: 4 }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Дадлагын жагсаалт</h1>
        <p className="text-gray-500">Тохирох дадлагаа олж, хүсэлтээ илгээнэ үү</p>
        
        {activeInternship && activeInternship.status === 'active' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Badge status="processing" />
              <span className="font-medium">Таны одоогийн дадлага идэвхтэй байна: {activeInternship.organization} - {activeInternship.position}</span>
              <Button className="ml-auto" variant="outline" size="sm" onClick={() => window.location.href = '/student/internship-info'}>
                Дэлгэрэнгүй <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
        )}
                  </div>
      
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Хайлт</label>
            <Input 
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Дадлагын болон байгууллагын нэрээр хайх..."
              prefix={<Search className="h-4 w-4 text-gray-400" />}
              className="w-full"
                  />
                </div>
          
          <div className="w-full lg:w-48">
            <label className="block text-sm font-medium mb-1">Ангилал</label>
                <Select
              value={filterCategory}
                  onChange={handleFilterChange}
              className="w-full"
                  options={[
                { value: 'all', label: 'Бүх ангилал' },
                    { value: 'Програм хангамж', label: 'Програм хангамж' },
                    { value: 'Дата шинжилгээ', label: 'Дата шинжилгээ' },
                    { value: 'Кибер аюулгүй байдал', label: 'Кибер аюулгүй байдал' },
                    { value: 'Маркетинг', label: 'Маркетинг' },
              ]}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex items-center"
            >
              <i className="fas fa-th-large mr-1"></i> Карт
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex items-center"
            >
              <i className="fas fa-list mr-1"></i> Жагсаалт
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center ml-2"
            >
              <Sliders className="h-4 w-4 mr-1" />
              Шүүлтүүр {showAdvancedFilters ? 'Хаах' : 'Нээх'}
            </Button>
          </div>
        </div>
        
        {showAdvancedFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 border-t pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-2">Цалингийн хэмжээ</h3>
                <Slider 
                  range 
                  value={salaryRange}
                  onChange={setSalaryRange}
                  min={0}
                  max={2000000}
                  step={100000}
                  tipFormatter={value => `${value.toLocaleString()}₮`}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0₮</span>
                  <span>2,000,000₮</span>
                </div>
            </div>

              <div>
                <h3 className="font-medium mb-2">Дадлагын төрөл</h3>
                <div className="space-y-2">
                  <Checkbox 
                    checked={selectedTypes.includes('Бүтэн цагийн')}
                    onChange={() => handleTypeChange('Бүтэн цагийн')}
                  >
                    Бүтэн цагийн
                  </Checkbox>
                        <div>
                    <Checkbox 
                      checked={selectedTypes.includes('Хагас цагийн')}
                      onChange={() => handleTypeChange('Хагас цагийн')}
                    >
                      Хагас цагийн
                    </Checkbox>
                          </div>
                        </div>
                      </div>
              
              <div className="flex items-end">
                        <Button
                          variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500"
                        >
                  Шүүлтүүр цэвэрлэх
                        </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {filteredInternships.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Тохирох дадлага олдсонгүй. Шүүлтүүрийг өөрчилж үзнэ үү."
        />
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }>
          {filteredInternships.map(listing => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`overflow-hidden hover:shadow-md transition-shadow ${listing.featured ? 'border-blue-300 bg-blue-50' : ''}`}>
                {listing.featured && (
                  <div className="bg-blue-500 text-white text-xs font-medium py-1 px-3 text-center">
                    Онцлох дадлага
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <img 
                        src={listing.logo} 
                        alt={listing.organization} 
                        className="w-16 h-16 rounded object-cover border"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg">{listing.position}</h3>
                        <button 
                          onClick={() => handleBookmark(listing.id)}
                          className="text-gray-400 hover:text-yellow-500 transition-colors"
                        >
                          <Bookmark className="h-5 w-5" fill={bookmarkedListings.includes(listing.id) ? "currentColor" : "none"} />
                        </button>
                      </div>
                      
                      <p className="text-gray-700 font-medium">{listing.organization}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className="flex items-center gap-1" color="blue">
                          <MapPin className="h-3 w-3" /> {listing.location}
                        </Badge>
                        <Badge className="flex items-center gap-1" color="green">
                          <Briefcase className="h-3 w-3" /> {listing.type}
                        </Badge>
                        <Badge className="flex items-center gap-1" color="purple">
                          <Clock className="h-3 w-3" /> {listing.duration}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Divider className="my-3" />
                  
                  <div className="mb-3">
                    <p className="text-gray-600 text-sm mb-2">{listing.description}</p>
                    
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Шаардлагууд:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {listing.requirements.slice(0, 3).map((req, i) => (
                          <Tag key={i} color="blue">{req}</Tag>
                        ))}
                        {listing.requirements.length > 3 && (
                          <Tooltip title={listing.requirements.slice(3).join(', ')}>
                          <Tag color="blue">+{listing.requirements.length - 3}</Tag>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Давуу талууд:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {listing.benefits.slice(0, 3).map((benefit, i) => (
                          <Tag key={i} color="green">{benefit}</Tag>
                        ))}
                        {listing.benefits.length > 3 && (
                          <Tooltip title={listing.benefits.slice(3).join(', ')}>
                            <Tag color="green">+{listing.benefits.length - 3}</Tag>
                          </Tooltip>
            )}
          </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Хүсэлт хүлээн авах эцсийн хугацаа:</p>
                      <p className="font-medium">{listing.applyDeadline}</p>
                    </div>
                    <p className="font-bold text-blue-600">{listing.salary}</p>
                  </div>
                  
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/internship-details/${listing.id}`, '_blank')}
                      className="flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Дэлгэрэнгүй
                    </Button>
                    <Button
                      onClick={() => handleApply(listing.id)}
                      className="flex items-center"
                    >
                      <FileEdit className="h-4 w-4 mr-1" />
                      Хүсэлт илгээх
                    </Button>
                  </div>
              </div>
            </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternshipListings; 