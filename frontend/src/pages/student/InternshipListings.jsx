import React, { useState, useEffect } from 'react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { FileEdit, Calendar, User, Building, CheckSquare, Clock, Award, Star, FileText, UserRound, GraduationCap, ChevronRight, BookText, PresentationIcon, Search, MapPin, Briefcase, Bookmark, Share2 } from 'lucide-react';
import { Tag, Progress, Skeleton, Tooltip, Badge, Input, Select, Empty } from 'antd';
import api from '../../services/api';
import ErrorState from '../../components/UI/ErrorState';
import StatisticsCard from '../../components/Analytics/StatisticsCard';

const InternshipListings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internshipData, setInternshipData] = useState(null);
  const [activeInternship, setActiveInternship] = useState(null);
  const [internshipListings, setInternshipListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Идэвхтэй дадлагын мэдээлэл авах
        const internshipResponse = await api.get('/api/student/internship-info');
        setInternshipData(internshipResponse.data);
        setActiveInternship(internshipResponse.data);
        
        // Дадлагын зарууд авах
        const listingsResponse = await api.get('/api/internship-listings');
        setInternshipListings(listingsResponse.data);
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

  const filteredInternships = internshipListings.filter(listing => {
    const matchesSearch = 
      listing.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || listing.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

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

  // Хэрэв алдаа гарсан бол
  if (error && !loading) {
    return (
      <ErrorState 
        title="Алдаа гарлаа" 
        subTitle={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Дадлагын зар, мэдээлэл</h1>
        <p className="text-gray-500">Дадлагын боломжууд болон таны идэвхтэй дадлагын дэлгэрэнгүй мэдээлэл.</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton active paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : (
        <div>
          {/* Идэвхтэй дадлага харуулах хэсэг */}
          {internshipData && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Таны идэвхтэй дадлага</h2>
              <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center shadow mr-4">
                      <Building className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <h3 className="text-lg font-semibold mr-2">{internshipData.organization}</h3>
                        {getStatusTag(internshipData.status)}
                      </div>
                      <p className="text-gray-600 mb-1">{internshipData.position}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{internshipData.startDate} - {internshipData.endDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => window.location.href = '/student/internship-info'}
                    >
                      Дэлгэрэнгүй харах
                    </Button>
                    <Button
                      variant="outline"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => window.location.href = '/student/reports/new'}
                    >
                      Тайлан илгээх
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-600">Дадлагын явц:</div>
                    <div className="text-sm font-medium">{internshipData.progressPercent}%</div>
                  </div>
                  <Progress 
                    percent={internshipData.progressPercent} 
                    showInfo={false} 
                    strokeColor="#16a34a"
                    strokeWidth={8}
                  />
                </div>
              </Card>
            </div>
          )}

          {/* Дадлагын зарууд харуулах хэсэг */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-xl font-semibold mb-4 md:mb-0">Дадлагын зарууд</h2>
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <Input 
                  placeholder="Хайх..." 
                  prefix={<Search className="h-4 w-4 text-gray-400" />}
                  onChange={handleSearch}
                  value={searchQuery}
                  className="md:w-60"
                />
                <Select
                  defaultValue="all"
                  onChange={handleFilterChange}
                  style={{ minWidth: 150 }}
                  options={[
                    { value: 'all', label: 'Бүх төрөл' },
                    { value: 'Програм хангамж', label: 'Програм хангамж' },
                    { value: 'Дата шинжилгээ', label: 'Дата шинжилгээ' },
                    { value: 'Кибер аюулгүй байдал', label: 'Кибер аюулгүй байдал' },
                    { value: 'Маркетинг', label: 'Маркетинг' },
                    { value: 'Бизнес', label: 'Бизнес' }
                  ]}
                />
              </div>
            </div>

            {filteredInternships.length > 0 ? (
              <div className="space-y-4">
                {filteredInternships.map(listing => (
                  <Card 
                    key={listing.id} 
                    className={`p-6 transition-all hover:shadow-md ${listing.featured ? 'border-l-4 border-l-amber-400' : ''}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start">
                        <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center shadow mr-4 border">
                          {listing.logo ? (
                            <img src={listing.logo} alt={listing.organization} className="h-10 w-10 object-contain" />
                          ) : (
                            <Building className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{listing.position}</h3>
                            {listing.featured && (
                              <Tag color="warning">Онцлох</Tag>
                            )}
                          </div>
                          <p className="text-gray-700 mb-1">{listing.organization}</p>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              {listing.location}
                            </span>
                            <span className="flex items-center">
                              <Briefcase className="h-3.5 w-3.5 mr-1" />
                              {listing.type}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {listing.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2 lg:mt-0">
                        <Button
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50 py-1.5 h-auto"
                          onClick={() => window.location.href = `/student/internship-listings/${listing.id}`}
                        >
                          Дэлгэрэнгүй
                        </Button>
                        <Button
                          variant="primary"
                          className="bg-green-600 hover:bg-green-700 text-white py-1.5 h-auto"
                          onClick={() => window.location.href = `/student/apply-internship/${listing.id}`}
                        >
                          Бүртгүүлэх
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1.5 h-auto"
                          onClick={() => alert('Хадгалагдлаа')}
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1.5 h-auto"
                          onClick={() => alert('Хуваалцагдлаа')}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-600">{listing.description}</p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {listing.requirements.slice(0, 3).map((req, index) => (
                          <Tag key={index} color="blue">{req}</Tag>
                        ))}
                        {listing.requirements.length > 3 && (
                          <Tag color="blue">+{listing.requirements.length - 3}</Tag>
                        )}
                      </div>
                      
                      <div className="mt-4 flex flex-wrap items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-gray-500 text-sm mr-1">Цалин:</span>
                          <span className="font-medium text-gray-800">{listing.salary}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Хугацаа: {listing.applyDeadline} хүртэл
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty 
                description="Хайлтад тохирох дадлагын зар олдсонгүй" 
                className="py-12"
              />
            )}
          </div>

          {/* Дадлагын зөвлөмж хэсэг */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Дадлагын зөвлөмж</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="text-center mb-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <FileEdit className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-blue-800">CV-гээ бэлтгэ</h3>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Чансаатай дадлага авахын тулд CV-гээ чанартай бэлтгэж, өөрийн ур чадварыг товч тодорхой тусгах хэрэгтэй.
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <div className="text-center mb-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                      <CheckSquare className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-amber-800">Үндсэн шаардлага</h3>
                  </div>
                  <p className="text-amber-700 text-sm">
                    Дадлагын зарын шаардлагыг сайтар судалж, өөрийн мэдлэг, ур чадварт тохирсон дадлагад бүртгүүлэх нь чухал.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="text-center mb-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-green-800">Бэлтгэлээ хангах</h3>
                  </div>
                  <p className="text-green-700 text-sm">
                    Байгууллагын тухай судлах, ярилцлагад бэлтгэх, мэргэжлийн асуултуудын хариултаа бэлтгэх нь чухал.
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => window.location.href = '/student/internship-guide'}
                >
                  Дадлагын бүрэн удирдамж үзэх
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipListings; 