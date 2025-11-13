import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

interface CalendarHeaderProps {
  viewType: ViewType;
  setViewType: (view: ViewType) => void;
  currentViewTitle: string;
  onChangeDate: (delta: number) => void;
  onToday: () => void;
  onToggleSettings: () => void;
  newItem: Partial<CalendarItem>;
  setNewItem: (item: Partial<CalendarItem>) => void;
  onAddItem: () => void;
}

const CalendarHeader = ({
  viewType,
  setViewType,
  currentViewTitle,
  onChangeDate,
  onToday,
  onToggleSettings,
  newItem,
  setNewItem,
  onAddItem
}: CalendarHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 mb-8 animate-fade-in">
      <div className="flex justify-between items-start">
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
                <Button onClick={onAddItem} className="w-full">Создать</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            variant="outline" 
            size="icon"
            onClick={onToggleSettings}
          >
            <Icon name="Settings" size={18} />
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Tabs value={viewType} onValueChange={(v) => setViewType(v as ViewType)} className="w-auto">
          <TabsList>
            <TabsTrigger value="month" className="gap-2">
              <Icon name="Calendar" size={16} />
              Месяц
            </TabsTrigger>
            <TabsTrigger value="week" className="gap-2">
              <Icon name="CalendarDays" size={16} />
              Неделя
            </TabsTrigger>
            <TabsTrigger value="day" className="gap-2">
              <Icon name="CalendarClock" size={16} />
              День
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onToday}>
            Сегодня
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onChangeDate(-1)}>
              <Icon name="ChevronLeft" size={20} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onChangeDate(1)}>
              <Icon name="ChevronRight" size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div className="text-xl font-semibold text-gray-700">
        {currentViewTitle}
      </div>
    </div>
  );
};

export default CalendarHeader;
