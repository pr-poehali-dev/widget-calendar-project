import { useState } from 'react';
import CalendarHeader from '@/components/CalendarHeader';
import CalendarViews from '@/components/CalendarViews';
import CalendarWidgets from '@/components/CalendarWidgets';

type EventType = 'event' | 'task' | 'reminder';
type ViewType = 'month' | 'week' | 'day';

interface CalendarItem {
  id: string;
  title: string;
  type: EventType;
  date: Date;
  time?: string;
  description?: string;
  completed?: boolean;
}

interface Widget {
  id: string;
  type: 'stats' | 'notes' | 'upcoming' | 'focus' | 'timeline';
  enabled: boolean;
}

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewType, setViewType] = useState<ViewType>('month');
  const [items, setItems] = useState<CalendarItem[]>([
    {
      id: '1',
      title: 'Встреча с командой',
      type: 'event',
      date: new Date(2025, 10, 15, 10, 0),
      time: '10:00',
      description: 'Обсуждение проекта'
    },
    {
      id: '2',
      title: 'Завершить отчёт',
      type: 'task',
      date: new Date(2025, 10, 15, 14, 0),
      time: '14:00',
      completed: false
    },
    {
      id: '3',
      title: 'Позвонить клиенту',
      type: 'reminder',
      date: new Date(2025, 10, 15, 16, 30),
      time: '16:30'
    },
    {
      id: '4',
      title: 'Обед с партнёрами',
      type: 'event',
      date: new Date(2025, 10, 16, 13, 0),
      time: '13:00'
    }
  ]);
  
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: '2', type: 'stats', enabled: true },
    { id: '3', type: 'notes', enabled: true },
    { id: '4', type: 'upcoming', enabled: true },
    { id: '5', type: 'focus', enabled: true },
    { id: '6', type: 'timeline', enabled: true }
  ]);

  const [newItem, setNewItem] = useState<Partial<CalendarItem>>({});
  const [showSettings, setShowSettings] = useState(false);

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const fullDayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

  const getWeekDays = (date: Date) => {
    const dayOfWeek = (date.getDay() + 6) % 7;
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const changeDate = (delta: number) => {
    if (viewType === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
    } else if (viewType === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + (delta * 7));
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + delta);
      setCurrentDate(newDate);
    }
  };

  const getTypeColor = (type: EventType) => {
    switch (type) {
      case 'event': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'task': return 'bg-green-100 text-green-700 border-green-200';
      case 'reminder': return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  const getTypeIcon = (type: EventType) => {
    switch (type) {
      case 'event': return 'Calendar';
      case 'task': return 'CheckSquare';
      case 'reminder': return 'Bell';
    }
  };

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w));
  };

  const addItem = () => {
    if (newItem.title && newItem.type && newItem.date) {
      setItems([...items, { ...newItem, id: Date.now().toString() } as CalendarItem]);
      setNewItem({});
    }
  };

  const toggleTask = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const getCurrentViewTitle = () => {
    if (viewType === 'month') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (viewType === 'week') {
      const weekDays = getWeekDays(currentDate);
      const start = weekDays[0];
      const end = weekDays[6];
      return `${start.getDate()} ${monthNames[start.getMonth()]} - ${end.getDate()} ${monthNames[end.getMonth()]} ${currentDate.getFullYear()}`;
    } else {
      const dayOfWeek = (currentDate.getDay() + 6) % 7;
      return `${fullDayNames[dayOfWeek]}, ${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <CalendarHeader
          viewType={viewType}
          setViewType={setViewType}
          currentViewTitle={getCurrentViewTitle()}
          onChangeDate={changeDate}
          onToday={() => setCurrentDate(new Date())}
          onToggleSettings={() => setShowSettings(!showSettings)}
          newItem={newItem}
          setNewItem={setNewItem}
          onAddItem={addItem}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CalendarViews
              viewType={viewType}
              currentDate={currentDate}
              items={items}
              onSelectDate={setSelectedDate}
              onToggleTask={toggleTask}
              getTypeColor={getTypeColor}
              getTypeIcon={getTypeIcon}
            />
          </div>

          <CalendarWidgets
            viewType={viewType}
            widgets={widgets}
            items={items}
            currentDate={currentDate}
            showSettings={showSettings}
            onToggleWidget={toggleWidget}
            onToggleTask={toggleTask}
            getTypeColor={getTypeColor}
            getTypeIcon={getTypeIcon}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
