import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card } from '../../../components/UI/Card';
import PageHeader from '../../../components/UI/PageHeader';
import { Tag, Badge, Tabs, Spin, Tooltip, Empty, Table, Alert } from 'antd';
import { Calendar as CalendarIcon, Clock, Users, BookOpen, Check, ChevronRight, AlertCircle } from 'lucide-react';
import api from '../../../services/api';
import ErrorState from '../../../components/UI/ErrorState';

const { TabPane } = Tabs;

// Монгол хэлэнд тохируулах
moment.locale('mn', {
  months: 'Нэгдүгээр сар_Хоёрдугаар сар_Гуравдугаар сар_Дөрөвдүгээр сар_Тавдугаар сар_Зургаадугаар сар_Долоодугаар сар_Наймдугаар сар_Есдүгээр сар_Аравдугаар сар_Арван нэгдүгээр сар_Арван хоёрдугаар сар'.split('_'),
  weekdays: 'Ням_Даваа_Мягмар_Лхагва_Пүрэв_Баасан_Бямба'.split('_'),
  weekdaysShort: 'Ням_Дав_Мяг_Лха_Пүр_Баа_Бям'.split('_'),
  weekdaysMin: 'Ня_Да_Мя_Лх_Пү_Ба_Бя'.split('_'),
});

const localizer = momentLocalizer(moment);

// Хуваарийн төрлүүд
const scheduleTypeColors = {
  class: 'blue',
  meeting: 'green',
  deadline: 'red',
  task: 'gold',
  other: 'purple'
};

const SchedulePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [internship, setInternship] = useState(null);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('calendar');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Дадлагын мэдээлэл авах
      const internshipResponse = await api.get('/api/v1/internships/my-internship/');
      setInternship(internshipResponse.data);

      // Хуваарийн эвентүүд авах
      const scheduleResponse = await api.get('/api/v1/internships/schedule/');
      
      // API ачааллахад алдаа гарвал жишээ өгөгдөл ашиглах
      if (!scheduleResponse.data) {
        setMockData();
        return;
      }
      
      // API-н хариу өгөгдөл
      const data = scheduleResponse.data;
      
      // Эвент хэлбэрт хөрвүүлэх
      const formattedEvents = data.events.map(evt => ({
        id: evt.id,
        title: evt.title,
        start: new Date(evt.start_time),
        end: new Date(evt.end_time),
        type: evt.type,
        allDay: evt.all_day || false,
        description: evt.description || '',
        location: evt.location || '',
        participants: evt.participants || []
      }));
      
      setEvents(formattedEvents);
      setWeeklySchedule(data.weekly_schedule || []);
      
      // Шаардлагатай бусад өгөгдөл
      const upcoming = formattedEvents
        .filter(e => moment(e.start).isAfter(moment()))
        .sort((a, b) => moment(a.start).diff(moment(b.start)))
        .slice(0, 5);
      
      setUpcomingEvents(upcoming);
    } catch (error) {
      console.error('Хуваарийн мэдээлэл авахад алдаа гарлаа:', error);
      setError('Хуваарийн мэдээлэл авахад алдаа гарлаа');
      // Алдаа гарвал жишээ өгөгдөл ашиглах
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  // Жишээ өгөгдөл
  const setMockData = () => {
    const now = moment();
    
    // Долоо хоногийн хуваарь
    const mockWeeklySchedule = [
      { 
        day: 'Monday', 
        dayMn: 'Даваа', 
        items: [
          { time: '09:00 - 12:00', activity: 'Дадлага - Фронт энд хөгжүүлэлт', location: 'Байгууллагын оффис' },
          { time: '13:00 - 15:00', activity: 'Багийн уулзалт', location: 'Хурлын өрөө 2' },
          { time: '15:30 - 17:00', activity: 'Код шалгалт', location: 'Оффис' }
        ] 
      },
      { 
        day: 'Tuesday', 
        dayMn: 'Мягмар', 
        items: [
          { time: '09:00 - 12:00', activity: 'Дадлага - UI компонентууд хөгжүүлэх', location: 'Байгууллагын оффис' },
          { time: '13:00 - 17:00', activity: 'Төслийн ажил', location: 'Оффис' }
        ] 
      },
      { 
        day: 'Wednesday', 
        dayMn: 'Лхагва', 
        items: [
          { time: '10:00 - 12:00', activity: 'Зайны хуралд оролцох', location: 'Zoom' },
          { time: '13:00 - 17:00', activity: 'Төслийн ажил', location: 'Оффис' }
        ] 
      },
      { 
        day: 'Thursday', 
        dayMn: 'Пүрэв', 
        items: [
          { time: '09:00 - 12:00', activity: 'Дадлага - Backend API хөгжүүлэлт', location: 'Оффис' },
          { time: '14:00 - 15:00', activity: 'Ментортой уулзах', location: 'Хурлын өрөө 1' },
          { time: '15:30 - 17:00', activity: 'Төслийн ажил', location: 'Оффис' }
        ] 
      },
      { 
        day: 'Friday', 
        dayMn: 'Баасан', 
        items: [
          { time: '09:00 - 11:00', activity: 'Дадлага - Тестүүд бичих', location: 'Оффис' },
          { time: '11:00 - 12:00', activity: 'Долоо хоногийн тайлан бэлтгэх', location: 'Оффис' },
          { time: '13:00 - 14:00', activity: 'Тайлан хүлээлгэн өгөх', location: 'Оффис' },
          { time: '14:00 - 16:00', activity: 'Судалгааны ажил', location: 'Сургалтын өрөө' }
        ] 
      }
    ];
    
    // Календарийн эвентүүд
    const mockEvents = [
      {
        id: 1,
        title: 'Долоо хоногийн тайлан',
        start: moment().day(5).hour(11).minute(0).toDate(),
        end: moment().day(5).hour(12).minute(0).toDate(),
        type: 'deadline',
        description: 'Долоо хоногийн тайланг бэлтгэж илгээх',
        location: 'Оффис'
      },
      {
        id: 2,
        title: 'Ментортой уулзалт',
        start: moment().day(4).hour(14).minute(0).toDate(),
        end: moment().day(4).hour(15).minute(0).toDate(),
        type: 'meeting',
        description: 'Төслийн явцын талаар ярилцах',
        location: 'Хурлын өрөө 1',
        participants: ['Батбаяр (Ментор)', 'Та']
      },
      {
        id: 3,
        title: 'Багшийн хяналт',
        start: moment().add(1, 'week').day(3).hour(13).minute(30).toDate(),
        end: moment().add(1, 'week').day(3).hour(14).minute(30).toDate(),
        type: 'meeting',
        description: 'Дадлагын явцыг хянах багштай уулзалт',
        location: 'Сургууль, 405 тоот',
        participants: ['Б. Баярхүү (Багш)', 'Та']
      },
      {
        id: 4,
        title: 'Эцсийн тайлан илгээх хугацаа',
        start: moment().add(4, 'weeks').day(5).hour(17).minute(0).toDate(),
        end: moment().add(4, 'weeks').day(5).hour(17).minute(0).toDate(),
        type: 'deadline',
        allDay: true,
        description: 'Дадлагын эцсийн тайланг илгээх',
      },
      {
        id: 5,
        title: 'UI/UX Судалгаа',
        start: moment().day(5).hour(14).minute(0).toDate(),
        end: moment().day(5).hour(16).minute(0).toDate(),
        type: 'task',
        description: 'UI/UX холбогдолтой судалгаа хийх',
        location: 'Сургалтын өрөө'
      },
      {
        id: 6,
        title: 'Багийн уулзалт',
        start: moment().day(1).hour(13).minute(0).toDate(),
        end: moment().day(1).hour(15).minute(0).toDate(),
        type: 'meeting',
        description: 'Долоо хоногийн төлөвлөгөө, үүрэг хуваарилалт',
        location: 'Хурлын өрөө 2',
        participants: ['Хөгжүүлэгчийн баг', 'Та']
      },
      {
        id: 7,
        title: 'Зайны хурал',
        start: moment().day(3).hour(10).minute(0).toDate(),
        end: moment().day(3).hour(12).minute(0).toDate(),
        type: 'meeting',
        description: 'Төслийн явцын тайлан',
        location: 'Zoom'
      },
    ];

    // Дараагийн эвентүүд
    const mockUpcoming = mockEvents
      .filter(e => moment(e.start).isAfter(moment()))
      .sort((a, b) => moment(a.start).diff(moment(b.start)))
      .slice(0, 5);

    setEvents(mockEvents);
    setWeeklySchedule(mockWeeklySchedule);
    setUpcomingEvents(mockUpcoming);
  };

  // Хуваарийн өнгийг төрлөөр олгох
  const getEventStyle = (event) => {
    const colorKey = event.type && scheduleTypeColors[event.type] 
      ? event.type 
      : 'other';
    
    return {
      style: {
        backgroundColor: scheduleTypeColors[colorKey],
      }
    };
  };

  // Эвент дээр дарахад дэлгэрэнгүй харуулах
  const handleSelectEvent = (event) => {
    console.log('Selected event:', event);
    // TODO: Modal цонх нээх
  };

  // Ирэх үйл явдлуудын жагсаалт
  const renderUpcomingEvents = () => {
    if (upcomingEvents.length === 0) {
      return <Empty description="Ирэх үйл явдал байхгүй байна" />;
    }
    
    return (
      <div className="space-y-3">
        {upcomingEvents.map(event => (
          <div 
            key={event.id} 
            className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
            onClick={() => handleSelectEvent(event)}
          >
            <div className={`mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-${scheduleTypeColors[event.type]}-100`}>
              {event.type === 'meeting' && <Users className={`h-5 w-5 text-${scheduleTypeColors[event.type]}-600`} />}
              {event.type === 'deadline' && <AlertCircle className={`h-5 w-5 text-${scheduleTypeColors[event.type]}-600`} />}
              {event.type === 'task' && <Check className={`h-5 w-5 text-${scheduleTypeColors[event.type]}-600`} />}
              {(event.type === 'class' || event.type === 'other') && <BookOpen className={`h-5 w-5 text-${scheduleTypeColors[event.type === 'class' ? 'class' : 'other']}-600`} />}
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">{event.title}</h4>
                <Tag color={scheduleTypeColors[event.type]}>
                  {event.type === 'meeting' ? 'Уулзалт' : 
                   event.type === 'deadline' ? 'Хугацаа' : 
                   event.type === 'task' ? 'Даалгавар' : 
                   event.type === 'class' ? 'Хичээл' : 'Бусад'}
                </Tag>
              </div>
              <div className="text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {moment(event.start).format('YYYY-MM-DD HH:mm')}
              </div>
              {event.location && (
                <div className="text-xs text-gray-500 mt-1">
                  {event.location}
                </div>
              )}
            </div>
            
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        ))}
      </div>
    );
  };

  // Долоо хоногийн хуваарь харуулах
  const renderWeeklySchedule = () => {
    if (weeklySchedule.length === 0) {
      return <Empty description="Долоо хоногийн хуваарь байхгүй байна" />;
    }
    
    return (
      <div className="space-y-4">
        {weeklySchedule.map((day, idx) => (
          <Card key={idx} className="overflow-hidden">
            <div className="bg-green-50 px-4 py-3 border-b border-green-100">
              <h3 className="font-medium text-green-700">{day.dayMn} ({day.day})</h3>
            </div>
            <div className="divide-y">
              {day.items.map((item, itemIdx) => (
                <div key={itemIdx} className="p-3 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="font-medium text-sm w-36">{item.time}</div>
                    <div className="flex-grow">
                      <div className="text-sm">{item.activity}</div>
                      {item.location && (
                        <div className="text-xs text-gray-500">{item.location}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  if (error) {
    return (
      <ErrorState 
        title="Хуваарь авахад алдаа гарлаа"
        subTitle="Дадлагын хуваарь авах үед алдаа гарлаа. Дахин оролдоно уу."
        onRetry={fetchData}
      />
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Дадлагын хуваарь"
        subtitle="Таны дадлагын хөтөлбөрийн хуваарь, чухал огноонууд"
      />

      {loading ? (
        <div className="flex justify-center p-12">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {!internship ? (
            <Alert
              message="Идэвхтэй дадлага олдсонгүй"
              description="Хуваарь харахын тулд та идэвхтэй дадлагатай байх шаардлагатай. Дадлагад бүртгүүлэх хэсэгт очиж дадлага бүртгүүлнэ үү."
              type="warning"
              showIcon
              className="mb-6"
            />
          ) : (
            <Card className="mb-6 p-4 flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{internship.organization} - {internship.position}</h3>
                <p className="text-sm text-gray-500">
                  {moment(internship.start_date).format('YYYY-MM-DD')} - {moment(internship.end_date).format('YYYY-MM-DD')}
                </p>
              </div>
              <Tag color="green" className="mt-2 md:mt-0">
                {internship.status === 1 ? 'Идэвхтэй' : internship.status === 2 ? 'Дууссан' : 'Хүлээгдэж буй'}
              </Tag>
            </Card>
          )}

          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane
              tab={
                <span className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Календар
                </span>
              }
              key="calendar"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow p-4">
                <div style={{ height: 600 }}>
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    eventPropGetter={getEventStyle}
                    onSelectEvent={handleSelectEvent}
                    views={['month', 'week', 'day', 'agenda']}
                    messages={{
                      month: 'Сар',
                      week: '7 хоног',
                      day: 'Өдөр',
                      agenda: 'Хөтөлбөр',
                      previous: 'Өмнөх',
                      next: 'Дараах',
                      today: 'Өнөөдөр',
                      showMore: total => `+${total} дэлгэрэнгүй`
                    }}
                  />
                </div>
              </div>
            </TabPane>
            
            <TabPane
              tab={
                <span className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Долоо хоногийн хуваарь
                </span>
              }
              key="weekly"
            >
              {renderWeeklySchedule()}
            </TabPane>
            
            <TabPane
              tab={
                <span className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Ирэх үйл явдлууд
                </span>
              }
              key="upcoming"
            >
              {renderUpcomingEvents()}
            </TabPane>
          </Tabs>
          
          <div className="mt-4 bg-gray-50 p-3 rounded-md">
            <h3 className="text-sm font-medium mb-2">Тайлбар:</h3>
            <div className="flex flex-wrap gap-3">
              <Tag color={scheduleTypeColors.meeting}>Уулзалт</Tag>
              <Tag color={scheduleTypeColors.deadline}>Хугацаа</Tag>
              <Tag color={scheduleTypeColors.task}>Даалгавар</Tag>
              <Tag color={scheduleTypeColors.class}>Хичээл</Tag>
              <Tag color={scheduleTypeColors.other}>Бусад</Tag>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SchedulePage; 