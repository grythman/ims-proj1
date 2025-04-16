import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Tag, Badge, Select, Spin, Drawer, Tabs, Empty } from 'antd';
import { Card } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import PageHeader from '../../../components/UI/PageHeader';
import { Alert } from 'antd';
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, Users, BookOpen, CheckCircle, XCircle, Info } from 'lucide-react';
import dayjs from 'dayjs';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';

const { TabPane } = Tabs;
const { Option } = Select;

// Цагийн өнгө тодорхойлох
const getEventColor = (type) => {
  switch (type) {
    case 'internship':
      return 'green';
    case 'class':
      return 'blue';
    case 'meeting':
      return 'purple';
    case 'deadline':
      return 'red';
    case 'report':
      return 'orange';
    default:
      return 'gray';
  }
};

// Event төрлийн Монгол нэр
const getEventTypeLabel = (type) => {
  switch (type) {
    case 'internship':
      return 'Дадлага';
    case 'class':
      return 'Хичээл';
    case 'meeting':
      return 'Уулзалт';
    case 'deadline':
      return 'Хугацаа дуусах';
    case 'report':
      return 'Тайлан';
    default:
      return type;
  }
};

const SchedulePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('calendar'); // calendar, list, weekly
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState(['internship', 'class', 'meeting', 'deadline', 'report']);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeInternship, setActiveInternship] = useState(null);
  
  useEffect(() => {
    fetchEvents();
    fetchActiveInternship();
  }, []);

  useEffect(() => {
    // Шүүлтүүр хийгдэх бүрт event-уудыг шүүх
    if (events.length > 0) {
      const filtered = events.filter(event => selectedFilters.includes(event.type));
      setFilteredEvents(filtered);
    }
  }, [selectedFilters, events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log('Хуваарийн мэдээлэл татаж байна...');
      
      // API-аас хуваарийн мэдээлэл татах
      // const response = await api.get('/api/v1/schedule/events');
      // setEvents(response.data);
      
      // Туршилтын өгөгдөл
      const mockEvents = [
        {
          id: 1,
          title: 'Дадлагын цаг',
          description: 'Програм хөгжүүлэлтийн дадлага',
          start: dayjs().hour(9).minute(0).second(0).toDate(),
          end: dayjs().hour(17).minute(0).second(0).toDate(),
          type: 'internship',
          location: 'Монгол Апп ХХК',
          status: 'scheduled'
        },
        {
          id: 2,
          title: 'Веб Програмчлал II',
          description: 'Хичээлийн цаг',
          start: dayjs().add(1, 'day').hour(13).minute(0).second(0).toDate(),
          end: dayjs().add(1, 'day').hour(15).minute(30).second(0).toDate(),
          type: 'class',
          location: 'Сургалтын байр - 3А-304',
          status: 'scheduled'
        },
        {
          id: 3,
          title: 'Ментортой уулзах',
          description: 'Тайлангийн асуудлаар зөвлөлдөх',
          start: dayjs().add(2, 'day').hour(10).minute(0).second(0).toDate(),
          end: dayjs().add(2, 'day').hour(11).minute(0).second(0).toDate(),
          type: 'meeting',
          location: 'Zoom - https://us02web.zoom.us/j/123456789',
          status: 'scheduled'
        },
        {
          id: 4,
          title: 'Долоо хоногийн тайлан хугацаа',
          description: 'Долоо хоногийн тайлан илгээх хугацаа дуусах',
          start: dayjs().add(3, 'day').hour(18).minute(0).second(0).toDate(),
          end: dayjs().add(3, 'day').hour(18).minute(0).second(0).toDate(),
          type: 'deadline',
          status: 'upcoming'
        },
        {
          id: 5,
          title: 'Сарын тайлан илгээх',
          description: 'Сарын ажлын тайлан илгээх',
          start: dayjs().add(10, 'day').hour(9).minute(0).second(0).toDate(),
          end: dayjs().add(10, 'day').hour(11).minute(0).second(0).toDate(),
          type: 'report',
          status: 'upcoming'
        },
        {
          id: 6,
          title: 'Дадлагын цаг',
          description: 'Програм хөгжүүлэлтийн дадлага',
          start: dayjs().add(1, 'day').hour(9).minute(0).second(0).toDate(),
          end: dayjs().add(1, 'day').hour(17).minute(0).second(0).toDate(),
          type: 'internship',
          location: 'Монгол Апп ХХК',
          status: 'scheduled'
        },
        {
          id: 7,
          title: 'Дадлагын цаг',
          description: 'Програм хөгжүүлэлтийн дадлага',
          start: dayjs().add(2, 'day').hour(9).minute(0).second(0).toDate(),
          end: dayjs().add(2, 'day').hour(17).minute(0).second(0).toDate(),
          type: 'internship',
          location: 'Монгол Апп ХХК',
          status: 'scheduled'
        },
        {
          id: 8,
          title: 'Дадлагын цаг',
          description: 'Програм хөгжүүлэлтийн дадлага',
          start: dayjs().add(3, 'day').hour(9).minute(0).second(0).toDate(),
          end: dayjs().add(3, 'day').hour(17).minute(0).second(0).toDate(),
          type: 'internship',
          location: 'Монгол Апп ХХК',
          status: 'scheduled'
        },
        {
          id: 9,
          title: 'Веб Програмчлал II',
          description: 'Хичээлийн цаг',
          start: dayjs().add(4, 'day').hour(13).minute(0).second(0).toDate(),
          end: dayjs().add(4, 'day').hour(15).minute(30).second(0).toDate(), 
          type: 'class',
          location: 'Сургалтын байр - 3А-304',
          status: 'scheduled'
        },
        {
          id: 10,
          title: 'Багштай уулзах',
          description: 'Дадлагын явцын талаар ярилцах',
          start: dayjs().add(5, 'day').hour(14).minute(0).second(0).toDate(),
          end: dayjs().add(5, 'day').hour(15).minute(0).second(0).toDate(),
          type: 'meeting',
          location: 'Сургалтын байр - 3А-304',
          status: 'scheduled'
        }
      ];
      
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      
    } catch (error) {
      console.error('Хуваарийн мэдээлэл татахад алдаа гарлаа:', error);
      setError('Хуваарийн мэдээлэл татахад алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveInternship = async () => {
    try {
      const response = await api.get('/api/v1/internships/my-internship/');
      setActiveInternship(response.data);
    } catch (error) {
      console.error('Идэвхтэй дадлага татахад алдаа гарлаа:', error);
      
      // Туршилтын өгөгдөл
      setActiveInternship({
        id: 1,
        organization: 'Монгол Апп ХХК',
        position: 'Веб хөгжүүлэгч',
        start_date: '2023-09-01',
        end_date: '2023-12-31',
        schedule: 'Даваа-Баасан, 9:00-18:00',
        status: 'active'
      });
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    
    // Өдрийн харагдацруу шилжих
    if (viewMode === 'month') {
      setViewMode('day');
    }
  };

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setDrawerVisible(true);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const getMonthData = (value) => {
    if (value.month() === dayjs().month()) {
      const eventsCount = filteredEvents.filter(event => 
        dayjs(event.start).month() === value.month()
      ).length;
      
      return eventsCount > 0 ? eventsCount : null;
    }
    return null;
  };

  const dateCellRender = (value) => {
    const listData = filteredEvents.filter(event => 
      dayjs(event.start).date() === value.date() && 
      dayjs(event.start).month() === value.month() &&
      dayjs(event.start).year() === value.year()
    );
    
    return (
      <ul className="events">
        {listData.slice(0, 3).map(item => (
          <li key={item.id} 
              onClick={(e) => {
                e.stopPropagation();
                handleEventClick(item);
              }}
              className="cursor-pointer">
            <Badge 
              color={getEventColor(item.type)} 
              text={<span className="text-xs truncate block">{item.title}</span>} 
            />
          </li>
        ))}
        {listData.length > 3 && (
          <li className="text-xs text-blue-600">+{listData.length - 3} дэлгэрэнгүй</li>
        )}
      </ul>
    );
  };

  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <Badge color="blue" text={`${num} хуваарь`} />
      </div>
    ) : null;
  };

  const renderEventDetails = () => {
    if (!selectedEvent) return null;
    
    const eventColor = getEventColor(selectedEvent.type);
    
    return (
      <div>
        <div className={`bg-${eventColor}-50 p-4 rounded-lg mb-4`}>
          <h3 className={`text-${eventColor}-800 text-lg font-medium mb-1`}>{selectedEvent.title}</h3>
          <p className={`text-${eventColor}-600`}>{selectedEvent.description}</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2 mt-1" />
            <div>
              <p className="font-medium">Огноо</p>
              <p>{dayjs(selectedEvent.start).format('YYYY/MM/DD')}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-gray-400 mr-2 mt-1" />
            <div>
              <p className="font-medium">Цаг</p>
              <p>{dayjs(selectedEvent.start).format('HH:mm')} - {dayjs(selectedEvent.end).format('HH:mm')}</p>
            </div>
          </div>
          
          {selectedEvent.location && (
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-1" />
              <div>
                <p className="font-medium">Байршил</p>
                <p>{selectedEvent.location}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-start">
            <Info className="h-5 w-5 text-gray-400 mr-2 mt-1" />
            <div>
              <p className="font-medium">Төрөл</p>
              <Tag color={eventColor}>{getEventTypeLabel(selectedEvent.type)}</Tag>
            </div>
          </div>
          
          <div className="flex items-start">
            <Info className="h-5 w-5 text-gray-400 mr-2 mt-1" />
            <div>
              <p className="font-medium">Төлөв</p>
              {selectedEvent.status === 'scheduled' && (
                <Tag color="blue">Товлогдсон</Tag>
              )}
              {selectedEvent.status === 'completed' && (
                <Tag color="green">Дууссан</Tag>
              )}
              {selectedEvent.status === 'cancelled' && (
                <Tag color="red">Цуцлагдсан</Tag>
              )}
              {selectedEvent.status === 'upcoming' && (
                <Tag color="orange">Удахгүй</Tag>
              )}
            </div>
          </div>
        </div>
        
        {selectedEvent.type === 'report' && (
          <div className="mt-6">
            <Button 
              onClick={() => navigate('/student/reports/submit')}
              className="w-full"
            >
              Тайлан илгээх
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderScheduleSummary = () => {
    if (!activeInternship) return null;
    
    return (
      <Card className="mb-6">
        <div className="p-4">
          <h3 className="text-lg font-medium mb-4">Дадлагын хуваарь</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-1" />
              <div>
                <p className="font-medium">Байгууллага</p>
                <p>{activeInternship.organization}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Users className="h-5 w-5 text-gray-400 mr-2 mt-1" />
              <div>
                <p className="font-medium">Албан тушаал</p>
                <p>{activeInternship.position}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2 mt-1" />
              <div>
                <p className="font-medium">Огноо</p>
                <p>{activeInternship.start_date} - {activeInternship.end_date}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-400 mr-2 mt-1" />
              <div>
                <p className="font-medium">Цагийн хуваарь</p>
                <p>{activeInternship.schedule || 'Даваа-Баасан, 9:00-18:00'}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderCalendar = () => {
    return (
      <>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Select 
              value={viewMode} 
              onChange={handleViewModeChange}
              className="w-32"
            >
              <Option value="month">Сар</Option>
              <Option value="week">Долоо хоног</Option>
              <Option value="day">Өдөр</Option>
            </Select>
          </div>
          
          <div>
            <Select
              mode="multiple"
              placeholder="Төрлөөр шүүх"
              value={selectedFilters}
              onChange={handleFilterChange}
              style={{ minWidth: '200px' }}
            >
              <Option value="internship">
                <Badge color={getEventColor('internship')} text="Дадлага" />
              </Option>
              <Option value="class">
                <Badge color={getEventColor('class')} text="Хичээл" />
              </Option>
              <Option value="meeting">
                <Badge color={getEventColor('meeting')} text="Уулзалт" />
              </Option>
              <Option value="deadline">
                <Badge color={getEventColor('deadline')} text="Хугацаа дуусах" />
              </Option>
              <Option value="report">
                <Badge color={getEventColor('report')} text="Тайлан" />
              </Option>
            </Select>
          </div>
        </div>
        
        <Card>
          <Calendar 
            value={selectedDate}
            onSelect={handleDateSelect}
            dateCellRender={dateCellRender}
            monthCellRender={monthCellRender}
            mode={viewMode}
          />
        </Card>
      </>
    );
  };

  const renderEventList = () => {
    // Өнөөдрийн цаг
    const today = dayjs().startOf('day');
    
    // Өнөөдрийн үйл явдлууд
    const todayEvents = filteredEvents.filter(event => 
      dayjs(event.start).isSame(today, 'day')
    );
    
    // Ирэх 7 хоногийн үйл явдлууд
    const upcomingEvents = filteredEvents.filter(event => 
      dayjs(event.start).isAfter(today, 'day') && 
      dayjs(event.start).isBefore(today.add(7, 'day'), 'day')
    );
    
    // Ирэх сарын үйл явдлууд
    const laterEvents = filteredEvents.filter(event => 
      dayjs(event.start).isAfter(today.add(7, 'day'), 'day')
    );
    
    return (
      <div className="space-y-6">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Өнөөдрийн хуваарь</h3>
            
            {todayEvents.length === 0 ? (
              <Empty description="Өнөөдөр товлосон үйл явдал байхгүй байна" />
            ) : (
              <div className="space-y-3">
                {todayEvents.map(event => (
                  <div 
                    key={event.id} 
                    className={`p-3 border-l-4 border-${getEventColor(event.type)}-500 bg-${getEventColor(event.type)}-50 rounded cursor-pointer hover:shadow-md transition-shadow`}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{event.title}</h4>
                      <Tag color={getEventColor(event.type)}>{getEventTypeLabel(event.type)}</Tag>
                    </div>
                    <p className="text-gray-600 text-sm">{dayjs(event.start).format('HH:mm')} - {dayjs(event.end).format('HH:mm')}</p>
                    {event.location && (
                      <p className="text-gray-500 text-sm flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" /> {event.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
        
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Ирэх 7 хоногийн хуваарь</h3>
            
            {upcomingEvents.length === 0 ? (
              <Empty description="Ирэх 7 хоногт товлосон үйл явдал байхгүй байна" />
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div 
                    key={event.id} 
                    className="p-3 border rounded bg-white cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{event.title}</h4>
                      <Tag color={getEventColor(event.type)}>{getEventTypeLabel(event.type)}</Tag>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {dayjs(event.start).format('YYYY/MM/DD HH:mm')} - {dayjs(event.end).format('HH:mm')}
                    </p>
                    {event.location && (
                      <p className="text-gray-500 text-sm flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" /> {event.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      );
    }

    if (error) {
      return (
        <Alert
          message="Алдаа гарлаа"
          description={error}
          type="error"
          showIcon
          action={
            <Button onClick={fetchEvents}>
              Дахин оролдох
            </Button>
          }
        />
      );
    }

    return (
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Календар" key="calendar">
          {renderCalendar()}
        </TabPane>
        <TabPane tab="Жагсаалт" key="list">
          {renderEventList()}
        </TabPane>
      </Tabs>
    );
  };

  return (
    <div>
      <PageHeader
        title="Дадлагын хуваарь"
        subtitle="Дадлага, хичээл болон бусад үйл ажиллагааны хуваарь"
      />
      
      {renderScheduleSummary()}
      
      {renderContent()}
      
      <Drawer
        title="Дэлгэрэнгүй мэдээлэл"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={360}
      >
        {renderEventDetails()}
      </Drawer>
    </div>
  );
};

export default SchedulePage; 