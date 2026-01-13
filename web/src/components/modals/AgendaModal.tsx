"use client";

import { useState, useMemo } from "react";
import {
  CalendarDays,
  Plus,
  Trash2,
  Edit,
  User,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Settings,
  Globe,
  UserCircle,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAgenda } from "@/contexts/AgendaContext";
import type { Appointment, CalendarScope } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const appointmentTypes = [
  { value: "meeting", label: "Réunion", color: "bg-blue-500" },
  { value: "call", label: "Appel", color: "bg-green-500" },
  { value: "event", label: "Événement", color: "bg-purple-500" },
  { value: "other", label: "Autre", color: "bg-gray-500" },
];

interface MonthCalendarProps {
  currentDate: Date;
  appointments: Appointment[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

function MonthCalendar({
  currentDate,
  appointments,
  onDateSelect,
  selectedDate,
}: MonthCalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const days = [];
  const startDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  for (let i = 0; i < startDay; i++) {
    const prevMonthDay = new Date(year, month, -startDay + i + 1);
    days.push({ date: prevMonthDay, isCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ date: new Date(year, month, day), isCurrentMonth: true });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
  }

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter((apt) => apt.date === dateStr);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dayAppointments = getAppointmentsForDate(day.date);
          const hasAppointments = dayAppointments.length > 0;

          return (
            <button
              key={index}
              onClick={() => onDateSelect(day.date)}
              className={cn(
                "relative aspect-square rounded-lg p-2 text-sm transition-all hover:bg-accent",
                !day.isCurrentMonth && "text-muted-foreground opacity-40",
                isToday(day.date) && "bg-primary/10 font-bold",
                isSelected(day.date) && "bg-primary text-primary-foreground",
              )}
            >
              <span className="block">{day.date.getDate()}</span>
              {hasAppointments && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {dayAppointments.slice(0, 3).map((apt) => (
                    <div
                      key={apt.id}
                      className={cn(
                        "h-1 w-1 rounded-full",
                        appointmentTypes.find((t) => t.value === apt.type)
                          ?.color || "bg-gray-500",
                      )}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface AppointmentListProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  currentUserId: string;
}

function AppointmentList({
  appointments,
  onEdit,
  onDelete,
  currentUserId,
}: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CalendarDays className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Aucun rendez-vous pour cette date</p>
      </div>
    );
  }

  const sortedAppointments = [...appointments].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
      {sortedAppointments.map((apt) => {
        const typeInfo = appointmentTypes.find((t) => t.value === apt.type);
        const canEdit =
          apt.scope === "personal" && apt.userId === currentUserId;

        return (
          <Card
            key={apt.id}
            className="glass-card border-border/40 hover:border-primary/30 transition-all group"
          >
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center justify-center min-w-15">
                  <span className="text-xs text-muted-foreground">
                    {apt.startTime}
                  </span>
                  <span className="text-xs text-muted-foreground">-</span>
                  <span className="text-xs text-muted-foreground">
                    {apt.endTime}
                  </span>
                </div>
                <div
                  className={cn(
                    "w-1 rounded-full",
                    typeInfo?.color || "bg-gray-500",
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{apt.title}</h3>
                      {apt.scope === "global" && (
                        <Globe className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <Badge variant="outline">{typeInfo?.label}</Badge>
                  </div>
                  {apt.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {apt.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {apt.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{apt.location}</span>
                      </div>
                    )}
                    {apt.attendees && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{apt.attendees}</span>
                      </div>
                    )}
                  </div>
                </div>
                {canEdit && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onEdit(apt)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => onDelete(apt.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function AgendaModal() {
  const {
    isOpen,
    closeAgenda,
    calendarScope,
    setCalendarScope,
    calendarSettings,
    updateCalendarSettings,
    selectedDate,
    setSelectedDate,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getFilteredAppointments,
    currentUserId,
  } = useAgenda();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"calendar" | "settings">("calendar");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    attendees: string;
    type: "meeting" | "call" | "event" | "other";
    scope: CalendarScope;
  }>({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
    location: "",
    attendees: "",
    type: "meeting",
    scope: "personal",
  });

  const filteredAppointments = useMemo(
    () => getFilteredAppointments(),
    [getFilteredAppointments],
  );

  const selectedDateAppointments = useMemo(
    () =>
      filteredAppointments.filter(
        (apt) => apt.date === selectedDate.toISOString().split("T")[0],
      ),
    [filteredAppointments, selectedDate],
  );

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const handleAddAppointment = () => {
    if (!formData.title || !formData.date || !formData.startTime) return;

    const typeInfo = appointmentTypes.find((t) => t.value === formData.type);

    addAppointment({
      title: formData.title,
      description: formData.description,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime || formData.startTime,
      location: formData.location,
      attendees: formData.attendees,
      type: formData.type,
      color: typeInfo?.color || "bg-gray-500",
      scope: formData.scope,
    });

    resetForm();
    setShowAddForm(false);
  };

  const handleEditAppointment = () => {
    if (
      !editingAppointment ||
      !formData.title ||
      !formData.date ||
      !formData.startTime
    )
      return;

    const typeInfo = appointmentTypes.find((t) => t.value === formData.type);

    updateAppointment(editingAppointment.id, {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime || formData.startTime,
      location: formData.location,
      attendees: formData.attendees,
      type: formData.type,
      color: typeInfo?.color || "bg-gray-500",
      scope: formData.scope,
    });

    resetForm();
    setEditingAppointment(null);
    setIsEditModalOpen(false);
  };

  const openEditModal = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      title: appointment.title,
      description: appointment.description || "",
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      location: appointment.location || "",
      attendees: appointment.attendees || "",
      type: appointment.type,
      scope: appointment.scope,
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "10:00",
      location: "",
      attendees: "",
      type: "meeting",
      scope: "personal",
    });
  };

  // Load example appointments on mount
  const loadExampleAppointments = () => {
    const existingAppointments = getFilteredAppointments();
    if (existingAppointments.length === 0) {
      const today = new Date();

      // Get current week dates
      const dayOfWeek = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

      const tuesday = new Date(monday);
      tuesday.setDate(monday.getDate() + 1);

      const wednesday = new Date(monday);
      wednesday.setDate(monday.getDate() + 2);

      const thursday = new Date(monday);
      thursday.setDate(monday.getDate() + 3);

      const friday = new Date(monday);
      friday.setDate(monday.getDate() + 4);

      const examples: Omit<Appointment, "id" | "createdAt" | "createdBy">[] = [
        {
          title: "Expiration Kbis",
          description:
            "Le Kbis de l'entreprise expire bientôt - Renouvellement nécessaire",
          date: wednesday.toISOString().split("T")[0],
          startTime: "09:00",
          endTime: "09:30",
          location: "",
          attendees: "Service Administratif",
          type: "event",
          color: "bg-purple-500",
          scope: "global",
        },
        {
          title: "Renouvellement contrat sous-traitant",
          description: "Contrat avec la société de nettoyage arrive à échéance",
          date: friday.toISOString().split("T")[0],
          startTime: "14:00",
          endTime: "15:00",
          location: "Bureau Direction",
          attendees: "Directeur, Responsable Achats",
          type: "meeting",
          color: "bg-blue-500",
          scope: "global",
        },
        {
          title: "Entretien de départ - Jean Dupont",
          description: "Entretien de sortie avec l'employé partant",
          date: tuesday.toISOString().split("T")[0],
          startTime: "10:00",
          endTime: "11:00",
          location: "Salle RH",
          attendees: "Jean Dupont, RH",
          type: "meeting",
          color: "bg-blue-500",
          scope: "personal",
        },
        {
          title: "Rappel: Visite médicale périodique",
          description: "Organiser les visites médicales du trimestre",
          date: thursday.toISOString().split("T")[0],
          startTime: "11:00",
          endTime: "11:30",
          location: "",
          attendees: "Service RH",
          type: "other",
          color: "bg-gray-500",
          scope: "global",
        },
        {
          title: "Expiration assurance RC Pro",
          description:
            "L'assurance responsabilité civile professionnelle expire dans 30 jours",
          date: friday.toISOString().split("T")[0],
          startTime: "09:00",
          endTime: "09:30",
          location: "",
          attendees: "Service Comptabilité",
          type: "event",
          color: "bg-purple-500",
          scope: "global",
        },
      ];

      examples.forEach((example) => {
        addAppointment(example);
      });
    }
  };

  return (
    <>
      <Modal
        open={isOpen}
        onOpenChange={closeAgenda}
        type="form"
        title="Agenda"
        size="xl"
        actions={{
          primary: {
            label: "Fermer",
            onClick: closeAgenda,
            variant: "outline",
          },
        }}
      >
        <Tabs
          value={view}
          onValueChange={(v) => setView(v as "calendar" | "settings")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4 mt-4">
            {/* Scope Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={calendarScope === "personal" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCalendarScope("personal")}
                  className="gap-2"
                >
                  <UserCircle className="h-4 w-4" />
                  Personnel
                </Button>
                <Button
                  variant={calendarScope === "global" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCalendarScope("global")}
                  className="gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Global
                </Button>
              </div>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                size="sm"
                variant={showAddForm ? "secondary" : "default"}
              >
                <Plus className="h-4 w-4 mr-2" />
                {showAddForm ? "Annuler" : "Nouveau"}
              </Button>
            </div>

            {/* Inline Add Form */}
            {showAddForm && (
              <Card className="glass-card border-primary/50">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium mb-4">
                    Nouveau rendez-vous
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="quick-title" className="text-xs">
                          Titre *
                        </Label>
                        <Input
                          id="quick-title"
                          placeholder="Ex: Réunion d'équipe"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quick-type" className="text-xs">
                          Type
                        </Label>
                        <Select
                          value={formData.type}
                          onValueChange={(
                            value: "meeting" | "call" | "event" | "other",
                          ) => setFormData({ ...formData, type: value })}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {appointmentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor="quick-date" className="text-xs">
                          Date *
                        </Label>
                        <Input
                          id="quick-date"
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quick-start" className="text-xs">
                          Début *
                        </Label>
                        <Input
                          id="quick-start"
                          type="time"
                          value={formData.startTime}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startTime: e.target.value,
                            })
                          }
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quick-end" className="text-xs">
                          Fin
                        </Label>
                        <Input
                          id="quick-end"
                          type="time"
                          value={formData.endTime}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              endTime: e.target.value,
                            })
                          }
                          className="h-9"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="quick-desc" className="text-xs">
                        Description
                      </Label>
                      <Input
                        id="quick-desc"
                        placeholder="Description du rendez-vous"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="h-9"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="quick-location" className="text-xs">
                          Lieu
                        </Label>
                        <Input
                          id="quick-location"
                          placeholder="Ex: Salle de réunion A"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quick-scope" className="text-xs">
                          Portée
                        </Label>
                        <Select
                          value={formData.scope}
                          onValueChange={(value: CalendarScope) =>
                            setFormData({ ...formData, scope: value })
                          }
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Personnel</SelectItem>
                            <SelectItem value="global">Global</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="quick-attendees" className="text-xs">
                        Participants
                      </Label>
                      <Input
                        id="quick-attendees"
                        placeholder="Ex: Jean Dupont, Marie Martin"
                        value={formData.attendees}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            attendees: e.target.value,
                          })
                        }
                        className="h-9"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          resetForm();
                          setShowAddForm(false);
                        }}
                      >
                        Annuler
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleAddAppointment}
                        disabled={
                          !formData.title ||
                          !formData.date ||
                          !formData.startTime
                        }
                      >
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Calendar and Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-light">
                    {currentDate.toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={previousMonth}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextMonth}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <MonthCalendar
                  currentDate={currentDate}
                  appointments={filteredAppointments}
                  onDateSelect={setSelectedDate}
                  selectedDate={selectedDate}
                />
              </div>

              {/* Appointments for selected date */}
              <div className="space-y-4">
                <h3 className="text-lg font-light">
                  {selectedDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </h3>
                <AppointmentList
                  appointments={selectedDateAppointments}
                  onEdit={openEditModal}
                  onDelete={deleteAppointment}
                  currentUserId={currentUserId}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Préférences du calendrier</h3>

              <div className="space-y-2">
                <Label>Vue par défaut au démarrage</Label>
                <Select
                  value={calendarSettings.defaultScope}
                  onValueChange={(value: CalendarScope) =>
                    updateCalendarSettings({ defaultScope: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personnel</SelectItem>
                    <SelectItem value="global">Global</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Afficher les week-ends</Label>
                <div className="flex gap-2">
                  <Button
                    variant={
                      calendarSettings.showWeekends ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      updateCalendarSettings({ showWeekends: true })
                    }
                  >
                    Oui
                  </Button>
                  <Button
                    variant={
                      !calendarSettings.showWeekends ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      updateCalendarSettings({ showWeekends: false })
                    }
                  >
                    Non
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Heure de début</Label>
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={calendarSettings.startHour}
                    onChange={(e) =>
                      updateCalendarSettings({
                        startHour: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Heure de fin</Label>
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={calendarSettings.endHour}
                    onChange={(e) =>
                      updateCalendarSettings({
                        endHour: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <h4 className="text-sm font-medium">
                  À propos des calendriers
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>Personnel :</strong> Vos rendez-vous privés +
                    événements globaux
                  </p>
                  <p>
                    <strong>Global :</strong> Événements visibles par tous
                    (entreprise)
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-dashed p-4 space-y-3">
                <h4 className="text-sm font-medium">Exemples de rendez-vous</h4>
                <p className="text-sm text-muted-foreground">
                  Charger des exemples de rappels et événements (expirations de
                  documents, entretiens de départ, contrats sous-traitants,
                  etc.)
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadExampleAppointments}
                  className="w-full"
                >
                  Charger les exemples
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        type="form"
        title="Modifier le rendez-vous"
        actions={{
          primary: {
            label: "Enregistrer",
            onClick: handleEditAppointment,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsEditModalOpen(false),
          },
        }}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Titre *</Label>
            <Input
              id="edit-title"
              placeholder="Ex: Réunion d'équipe"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Input
              id="edit-description"
              placeholder="Description du rendez-vous"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-date">Date *</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(
                  value: "meeting" | "call" | "event" | "other",
                ) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-startTime">Heure début *</Label>
              <Input
                id="edit-startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-endTime">Heure fin</Label>
              <Input
                id="edit-endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-location">Lieu</Label>
            <Input
              id="edit-location"
              placeholder="Ex: Salle de réunion A"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="edit-attendees">Participants</Label>
            <Input
              id="edit-attendees"
              placeholder="Ex: Jean Dupont, Marie Martin"
              value={formData.attendees}
              onChange={(e) =>
                setFormData({ ...formData, attendees: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="edit-scope">Portée</Label>
            <Select
              value={formData.scope}
              onValueChange={(value: CalendarScope) =>
                setFormData({ ...formData, scope: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personnel</SelectItem>
                <SelectItem value="global">
                  Global (visible par tous)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Modal>
    </>
  );
}
