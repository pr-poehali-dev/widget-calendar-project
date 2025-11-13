import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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

interface CalendarWidgetsProps {
  viewType: ViewType;
  widgets: Widget[];
  items: CalendarItem[];
  currentDate: Date;
  showSettings: boolean;
  onToggleWidget: (id: string) => void;
  onToggleTask: (id: string) => void;
  getTypeColor: (type: EventType) => string;
  getTypeIcon: (type: EventType) => string;
}

const CalendarWidgets = ({
  viewType,
  widgets,
  items,
  currentDate,
  showSettings,
  onToggleWidget,
  onToggleTask,
  getTypeColor,
  getTypeIcon
}: CalendarWidgetsProps) => {
  const upcomingItems = items
    .filter(item => item.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const completedTasks = items.filter(item => item.type === 'task' && item.completed).length;
  const totalTasks = items.filter(item => item.type === 'task').length;

  const getItemsForDate = (date: Date) => {
    return items.filter(item => 
      item.date.getDate() === date.getDate() &&
      item.date.getMonth() === date.getMonth() &&
      item.date.getFullYear() === date.getFullYear()
    );
  };

  const getTodayItems = () => {
    const today = viewType === 'day' ? currentDate : new Date();
    return getItemsForDate(today).sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
  };

  return (
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
                  {widget.type === 'stats' && '📊 Статистика'}
                  {widget.type === 'notes' && '📝 Заметки'}
                  {widget.type === 'upcoming' && '📅 Предстоящее'}
                  {widget.type === 'focus' && '🎯 Фокус дня'}
                  {widget.type === 'timeline' && '⏱️ Временная шкала'}
                </Label>
                <Switch 
                  checked={widget.enabled}
                  onCheckedChange={() => onToggleWidget(widget.id)}
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

      {widgets.find(w => w.type === 'focus' && w.enabled) && viewType === 'day' && (
        <Card className="shadow-lg animate-scale-in bg-gradient-to-br from-primary/5 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Target" size={20} />
              Фокус дня
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTodayItems().slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                    <Icon name={getTypeIcon(item.type)} size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.title}</div>
                    {item.time && <div className="text-xs text-gray-500">{item.time}</div>}
                  </div>
                </div>
              ))}
              {getTodayItems().length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">Нет запланированных задач</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {widgets.find(w => w.type === 'timeline' && w.enabled) && (viewType === 'week' || viewType === 'day') && (
        <Card className="shadow-lg animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Clock" size={20} />
              Временная шкала
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTodayItems().map((item, index) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      item.type === 'event' ? 'bg-blue-500' :
                      item.type === 'task' ? 'bg-green-500' : 'bg-purple-500'
                    }`} />
                    {index < getTodayItems().length - 1 && (
                      <div className="w-0.5 h-full bg-gray-300 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="text-xs text-gray-500 mb-1">{item.time || 'Без времени'}</div>
                    <div className="font-medium text-sm">{item.title}</div>
                    {item.description && (
                      <div className="text-xs text-gray-600 mt-1">{item.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {widgets.find(w => w.type === 'upcoming' && w.enabled) && viewType === 'month' && (
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
                            onClick={() => onToggleTask(item.id)}
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
  );
};

export default CalendarWidgets;
