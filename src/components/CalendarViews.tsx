import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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

interface CalendarViewsProps {
  viewType: ViewType;
  currentDate: Date;
  items: CalendarItem[];
  onSelectDate: (date: Date) => void;
  onToggleTask: (id: string) => void;
  getTypeColor: (type: EventType) => string;
  getTypeIcon: (type: EventType) => string;
}

const CalendarViews = ({
  viewType,
  currentDate,
  items,
  onSelectDate,
  onToggleTask,
  getTypeColor,
  getTypeIcon
}: CalendarViewsProps) => {
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;
    
    const days: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

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

  const getItemsForDate = (date: Date) => {
    return items.filter(item => 
      item.date.getDate() === date.getDate() &&
      item.date.getMonth() === date.getMonth() &&
      item.date.getFullYear() === date.getFullYear()
    );
  };

  const getItemsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return getItemsForDate(date);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getItemAtHour = (date: Date, hour: number) => {
    return items.filter(item => {
      if (!item.time) return false;
      const itemHour = parseInt(item.time.split(':')[0]);
      return item.date.getDate() === date.getDate() &&
             item.date.getMonth() === date.getMonth() &&
             item.date.getFullYear() === date.getFullYear() &&
             itemHour === hour;
    });
  };

  if (viewType === 'month') {
    return (
      <Card className="shadow-lg animate-scale-in">
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-2 mb-3">
            {dayNames.map((day) => (
              <div key={day} className="text-center font-medium text-sm text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth(currentDate).map((day, index) => {
              const dayItems = day ? getItemsForDay(day) : [];
              const isToday = day === new Date().getDate() && 
                             currentDate.getMonth() === new Date().getMonth() &&
                             currentDate.getFullYear() === new Date().getFullYear();
              
              return (
                <button
                  key={index}
                  className={`
                    min-h-[80px] p-2 rounded-lg border transition-all hover:shadow-md
                    ${day ? 'bg-white hover:bg-gray-50' : 'bg-transparent border-transparent'}
                    ${isToday ? 'border-primary border-2 bg-accent' : 'border-gray-200'}
                  `}
                  onClick={() => day && onSelectDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-primary' : 'text-gray-700'}`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayItems.slice(0, 2).map((item) => (
                          <div 
                            key={item.id}
                            className={`text-xs px-1.5 py-0.5 rounded border ${getTypeColor(item.type)} truncate`}
                          >
                            {item.title}
                          </div>
                        ))}
                        {dayItems.length > 2 && (
                          <div className="text-xs text-gray-500">+{dayItems.length - 2}</div>
                        )}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (viewType === 'week') {
    return (
      <Card className="shadow-lg animate-scale-in">
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-2">
            {getWeekDays(currentDate).map((date, index) => {
              const dayItems = getItemsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div key={index} className="flex flex-col">
                  <div className={`text-center p-3 rounded-t-lg border-b-2 ${isToday ? 'bg-accent border-primary' : 'bg-white border-gray-200'}`}>
                    <div className="text-xs text-gray-500 uppercase">{dayNames[index]}</div>
                    <div className={`text-2xl font-bold ${isToday ? 'text-primary' : 'text-gray-700'}`}>
                      {date.getDate()}
                    </div>
                  </div>
                  <div className="bg-white border border-t-0 rounded-b-lg p-2 min-h-[200px] space-y-2">
                    {dayItems.map((item) => (
                      <div 
                        key={item.id}
                        className={`text-xs p-2 rounded border ${getTypeColor(item.type)}`}
                      >
                        <div className="font-semibold truncate">{item.title}</div>
                        {item.time && <div className="text-xs mt-1">{item.time}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg animate-scale-in">
      <CardContent className="p-4">
        <div className="space-y-1 max-h-[600px] overflow-y-auto">
          {hours.map((hour) => {
            const hourItems = getItemAtHour(currentDate, hour);
            const timeStr = `${hour.toString().padStart(2, '0')}:00`;
            
            return (
              <div key={hour} className="flex gap-3 border-b border-gray-100 py-2">
                <div className="w-16 text-sm text-gray-500 font-medium pt-1">
                  {timeStr}
                </div>
                <div className="flex-1">
                  {hourItems.length > 0 ? (
                    <div className="space-y-2">
                      {hourItems.map((item) => (
                        <div 
                          key={item.id}
                          className={`p-3 rounded-lg border ${getTypeColor(item.type)} flex items-start gap-3`}
                        >
                          <Icon name={getTypeIcon(item.type)} size={16} />
                          <div className="flex-1">
                            <div className="font-semibold">{item.title}</div>
                            {item.description && (
                              <div className="text-xs mt-1 opacity-80">{item.description}</div>
                            )}
                            {item.time && <div className="text-xs mt-1">{item.time}</div>}
                          </div>
                          {item.type === 'task' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => onToggleTask(item.id)}
                            >
                              <Icon 
                                name={item.completed ? "CheckCircle2" : "Circle"} 
                                size={16}
                                className={item.completed ? "text-green-600" : ""}
                              />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-12" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarViews;
