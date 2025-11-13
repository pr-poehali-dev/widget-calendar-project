import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type EventType = 'event' | 'task' | 'reminder';

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
  type: 'weather' | 'stats' | 'notes' | 'upcoming';
  enabled: boolean;
}

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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
      date: new Date(2025, 10, 16),
      completed: false
    },
    {
      id: '3',
      title: 'Позвонить клиенту',
      type: 'reminder',
      date: new Date(2025, 10, 17, 14, 30),
      time: '14:30'
    }
  ]);
  
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: '1', type: 'weather', enabled: true },
    { id: '2', type: 'stats', enabled: true },
    { id: '3', type: 'notes', enabled: true },
    { id: '4', type: 'upcoming', enabled: true }
  ]);

  const [newItem, setNewItem] = useState<Partial<CalendarItem>>({});
  const [showSettings, setShowSettings] = useState(false);

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
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

  const getItemsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return items.filter(item => 
      item.date.getDate() === day &&
      item.date.getMonth() === currentDate.getMonth() &&
      item.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
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

  const upcomingItems = items
    .filter(item => item.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const completedTasks = items.filter(item => item.type === 'task' && item.completed).length;
  const totalTasks = items.filter(item => item.type === 'task').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Календарь</h1>
            <p className="text-gray-500 mt-1">Управляйте вашим временем эффективно</p>
          </div>
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Icon name="Plus" size={18} />
                  Добавить
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Новая запись</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Название</Label>
                    <Input 
                      placeholder="Введите название"
                      value={newItem.title || ''}
                      onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Тип</Label>
                    <Select onValueChange={(value: EventType) => setNewItem({ ...newItem, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="event">Событие</SelectItem>
                        <SelectItem value="task">Задача</SelectItem>
                        <SelectItem value="reminder">Напоминание</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Дата</Label>
                    <Input 
                      type="date"
                      onChange={(e) => setNewItem({ ...newItem, date: new Date(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Время (опционально)</Label>
                    <Input 
                      type="time"
                      onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Описание (опционально)</Label>
                    <Textarea 
                      placeholder="Добавьте детали..."
                      value={newItem.description || ''}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    />
                  </div>
                  <Button onClick={addItem} className="w-full">Создать</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Icon name="Settings" size={18} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg animate-scale-in">
              <CardHeader className="border-b bg-white/50">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)}>
                      <Icon name="ChevronLeft" size={20} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setCurrentDate(new Date())}>
                      <Icon name="Calendar" size={20} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => changeMonth(1)}>
                      <Icon name="ChevronRight" size={20} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
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
                    const dayItems = day ? getItemsForDate(day) : [];
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
                        onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
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
          </div>

          <div className="space-y-6">
            {showSettings && (
              <Card className="shadow-lg animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Settings" size={20} />
                    Настройки виджетов
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {widgets.map((widget) => (
                    <div key={widget.id} className="flex items-center justify-between">
                      <Label className="capitalize">
                        {widget.type === 'weather' && '☁️ Погода'}
                        {widget.type === 'stats' && '📊 Статистика'}
                        {widget.type === 'notes' && '📝 Заметки'}
                        {widget.type === 'upcoming' && '📅 Предстоящее'}
                      </Label>
                      <Switch 
                        checked={widget.enabled}
                        onCheckedChange={() => toggleWidget(widget.id)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {widgets.find(w => w.type === 'stats' && w.enabled) && (
              <Card className="shadow-lg animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="BarChart3" size={20} />
                    Статистика
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Выполнено задач</span>
                      <span className="font-semibold">{completedTasks}/{totalTasks}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-500"
                        style={{ width: `${totalTasks ? (completedTasks / totalTasks) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-700">
                        {items.filter(i => i.type === 'event').length}
                      </div>
                      <div className="text-xs text-blue-600">События</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-700">
                        {items.filter(i => i.type === 'task').length}
                      </div>
                      <div className="text-xs text-green-600">Задачи</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-700">
                        {items.filter(i => i.type === 'reminder').length}
                      </div>
                      <div className="text-xs text-purple-600">Уведомления</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {widgets.find(w => w.type === 'upcoming' && w.enabled) && (
              <Card className="shadow-lg animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Clock" size={20} />
                    Предстоящее
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingItems.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">Нет предстоящих событий</p>
                    ) : (
                      upcomingItems.map((item) => (
                        <div 
                          key={item.id} 
                          className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 hover:shadow-sm transition-all"
                        >
                          <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                            <Icon name={getTypeIcon(item.type)} size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">{item.title}</p>
                              {item.type === 'task' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2"
                                  onClick={() => toggleTask(item.id)}
                                >
                                  <Icon 
                                    name={item.completed ? "CheckCircle2" : "Circle"} 
                                    size={14}
                                    className={item.completed ? "text-green-600" : ""}
                                  />
                                </Button>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {item.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                              {item.time && ` в ${item.time}`}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {widgets.find(w => w.type === 'weather' && w.enabled) && (
              <Card className="shadow-lg animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Cloud" size={20} />
                    Погода
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-5xl">☀️</div>
                    <div className="text-3xl font-bold">22°C</div>
                    <div className="text-sm text-gray-600">Солнечно, легкий ветер</div>
                    <div className="grid grid-cols-3 gap-2 pt-3 text-xs">
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-gray-500">Влажность</div>
                        <div className="font-semibold">65%</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-gray-500">Ветер</div>
                        <div className="font-semibold">12 км/ч</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-gray-500">UV</div>
                        <div className="font-semibold">5</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {widgets.find(w => w.type === 'notes' && w.enabled) && (
              <Card className="shadow-lg animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="StickyNote" size={20} />
                    Быстрые заметки
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    placeholder="Введите заметку..."
                    className="min-h-[100px] resize-none"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
