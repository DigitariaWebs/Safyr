"use client";

import { useReducer, useState, useEffect } from "react";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Trash2,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Modal } from "@/components/ui/modal";
import {
  useDashboardConfigStore,
  SavedWidgetConfig,
  DashboardModule,
} from "@/lib/stores/dashboardConfigStore";

// ── Types ────────────────────────────────────────────────────────────

export type WidgetConfig = {
  id: string;
  name: string;
  visible: boolean;
  span?: string;
};

export type WidgetAction =
  | { type: "load"; payload: WidgetConfig[] }
  | { type: "toggle"; payload: string }
  | { type: "reorder"; payload: { oldIndex: number; newIndex: number } }
  | { type: "move"; payload: { activeId: string; overId: string } };

// ── Reducer ──────────────────────────────────────────────────────────

export function widgetReducer(
  state: WidgetConfig[],
  action: WidgetAction,
): WidgetConfig[] {
  switch (action.type) {
    case "load":
      return action.payload;
    case "toggle":
      return state.map((config) =>
        config.id === action.payload
          ? { ...config, visible: !config.visible }
          : config,
      );
    case "reorder":
      return arrayMove(state, action.payload.oldIndex, action.payload.newIndex);
    case "move": {
      const { activeId, overId } = action.payload;
      const activeIndex = state.findIndex((c) => c.id === activeId);
      const overIndex = state.findIndex((c) => c.id === overId);
      return arrayMove(state, activeIndex, overIndex);
    }
    default:
      return state;
  }
}

// ── SortableListItem (used inside modal vertical list) ───────────────

export function SortableListItem({
  config,
  index,
  toggleVisibility,
  moveUp,
  moveDown,
  total,
}: {
  config: WidgetConfig;
  index: number;
  toggleVisibility: (id: string) => void;
  moveUp: (index: number) => void;
  moveDown: (index: number) => void;
  total: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: config.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between"
    >
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          {...attributes}
          {...listeners}
          className="cursor-grab"
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        <Checkbox
          id={config.id}
          checked={config.visible}
          onCheckedChange={() => toggleVisibility(config.id)}
        />
        <label htmlFor={config.id} className="text-sm">
          {config.name}
        </label>
      </div>
      <div className="flex space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => moveUp(index)}
          disabled={index === 0}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => moveDown(index)}
          disabled={index === total - 1}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ── SortableGridItem (used in edit-mode grid) ─────────────────────────

export function SortableGridItem({
  config,
  isEditMode,
  toggleVisibility,
  children,
}: {
  config: WidgetConfig;
  isEditMode: boolean;
  toggleVisibility: (id: string) => void;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: config.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(config.span || "", "h-full relative")}
    >
      {children}
      {isEditMode && (
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleVisibility(config.id)}
            className="bg-background/80 rounded shadow h-6 w-6 p-0"
          >
            <Trash2 className="h-3 w-3 text-red-500" />
          </Button>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab bg-background/80 rounded p-1 shadow h-6 w-6 flex items-center justify-center"
          >
            <GripVertical className="h-3 w-3" />
          </div>
        </div>
      )}
    </div>
  );
}

// ── CustomizerModal ───────────────────────────────────────────────────

export function CustomizerModal({
  open,
  onOpenChange,
  configs,
  isEditMode,
  onToggleEditMode,
  onDragEnd,
  onToggle,
  onMoveUp,
  onMoveDown,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configs: WidgetConfig[];
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onDragEnd: (event: DragEndEvent) => void;
  onToggle: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      type="form"
      title="Personnaliser le tableau de bord"
      size="md"
      actions={{
        primary: {
          label: "Fermer",
          onClick: () => onOpenChange(false),
          variant: "outline",
        },
      }}
    >
      <Button
        variant={isEditMode ? "default" : "outline"}
        size="sm"
        onClick={() => {
          onToggleEditMode();
          onOpenChange(false);
        }}
        className="mb-4"
      >
        <GripVertical className="h-4 w-4 mr-2" />
        {isEditMode ? "Quitter Édition" : "Mode Édition"}
      </Button>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={configs.map((config) => config.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {configs.map((config, index) => (
              <SortableListItem
                key={config.id}
                config={config}
                index={index}
                toggleVisibility={onToggle}
                moveUp={onMoveUp}
                moveDown={onMoveDown}
                total={configs.length}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Modal>
  );
}

// ── WidgetGrid (edit-mode DnD grid) ──────────────────────────────────

export function WidgetGrid({
  configs,
  isEditMode,
  renderWidget,
  onToggle,
  onGridDragEnd,
  gridClassName,
}: {
  configs: WidgetConfig[];
  isEditMode: boolean;
  renderWidget: (config: WidgetConfig) => React.ReactNode;
  onToggle: (id: string) => void;
  onGridDragEnd: (event: DragEndEvent) => void;
  gridClassName?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const gridSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const visibleConfigs = configs.filter((c) => c.visible);
  const hiddenConfigs = configs.filter((c) => !c.visible);
  const activeConfig = configs.find((c) => c.id === activeId);
  const defaultGridClass =
    gridClassName ?? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4";

  return (
    <DndContext
      sensors={gridSensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => setActiveId(event.active.id as string)}
      onDragEnd={(event) => {
        setActiveId(null);
        onGridDragEnd(event);
      }}
    >
      <SortableContext
        items={visibleConfigs.map((c) => c.id)}
        strategy={rectSortingStrategy}
      >
        <div className={defaultGridClass}>
          {visibleConfigs.map((config) => (
            <SortableGridItem
              key={config.id}
              config={config}
              isEditMode={isEditMode}
              toggleVisibility={onToggle}
            >
              {renderWidget(config)}
            </SortableGridItem>
          ))}
        </div>
      </SortableContext>

      {hiddenConfigs.length > 0 && (
        <>
          <Separator className="my-6" />
          <div>
            <h2 className="text-sm font-light text-muted-foreground mb-4">
              Widgets masqués
            </h2>
            <SortableContext
              items={hiddenConfigs.map((c) => c.id)}
              strategy={rectSortingStrategy}
            >
              <div className={defaultGridClass}>
                {hiddenConfigs.map((config) => (
                  <SortableGridItem
                    key={config.id}
                    config={config}
                    isEditMode={isEditMode}
                    toggleVisibility={onToggle}
                  >
                    {renderWidget(config)}
                  </SortableGridItem>
                ))}
              </div>
            </SortableContext>
          </div>
        </>
      )}

      <DragOverlay>
        {activeConfig ? (
          <div className="rotate-3 opacity-90">
            <SortableGridItem
              config={activeConfig}
              isEditMode={isEditMode}
              toggleVisibility={onToggle}
            >
              {renderWidget(activeConfig)}
            </SortableGridItem>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// ── PersonnaliserButton ───────────────────────────────────────────────

export function PersonnaliserButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" className="gap-2" onClick={onClick}>
      <Settings className="h-4 w-4" />
      Personnaliser
    </Button>
  );
}

// ── useWidgetSystem hook ──────────────────────────────────────────────

export function useWidgetSystem(
  moduleKey: DashboardModule,
  defaultConfigs: WidgetConfig[],
) {
  const [widgetConfigs, dispatch] = useReducer(widgetReducer, defaultConfigs);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load from store on mount
  useEffect(() => {
    const savedConfigs = useDashboardConfigStore
      .getState()
      .getConfig(moduleKey);
    if (savedConfigs) {
      try {
        let loadedConfigs = savedConfigs
          .map((saved: SavedWidgetConfig) => {
            const defaultConfig = defaultConfigs.find((d) => d.id === saved.id);
            return defaultConfig ? { ...defaultConfig, ...saved } : null;
          })
          .filter(Boolean) as WidgetConfig[];
        const missingDefaults = defaultConfigs.filter((defaultConfig) =>
          savedConfigs.every(
            (saved: SavedWidgetConfig) => saved.id !== defaultConfig.id,
          ),
        );
        loadedConfigs = [...loadedConfigs, ...missingDefaults];
        dispatch({ type: "load", payload: loadedConfigs });
      } catch (e) {
        console.error("Error loading dashboard config:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save on change
  useEffect(() => {
    const toSave: SavedWidgetConfig[] = widgetConfigs.map((config) => ({
      id: config.id,
      name: config.name,
      visible: config.visible,
      span: config.span,
    }));
    useDashboardConfigStore.getState().setConfig(moduleKey, toSave);
  }, [widgetConfigs, moduleKey]);

  const toggleVisibility = (id: string) =>
    dispatch({ type: "toggle", payload: id });

  const moveUp = (index: number) => {
    if (index > 0)
      dispatch({
        type: "reorder",
        payload: { oldIndex: index, newIndex: index - 1 },
      });
  };

  const moveDown = (index: number) => {
    if (index < widgetConfigs.length - 1)
      dispatch({
        type: "reorder",
        payload: { oldIndex: index, newIndex: index + 1 },
      });
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      dispatch({
        type: "move",
        payload: { activeId: active.id as string, overId: over.id as string },
      });
    }
  }

  function handleGridDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const aId = active.id as string;
    const oId = over.id as string;
    const activeConfig = widgetConfigs.find((c) => c.id === aId);
    const overConfig = widgetConfigs.find((c) => c.id === oId);
    if (!activeConfig || !overConfig) return;
    if (activeConfig.visible === overConfig.visible) {
      dispatch({ type: "move", payload: { activeId: aId, overId: oId } });
    } else {
      dispatch({ type: "toggle", payload: aId });
      setTimeout(() => {
        dispatch({ type: "move", payload: { activeId: aId, overId: oId } });
      }, 0);
    }
  }

  const visibleWidgets = widgetConfigs.filter((c) => c.visible);
  const hiddenWidgets = widgetConfigs.filter((c) => !c.visible);

  return {
    widgetConfigs,
    dispatch,
    visibleWidgets,
    hiddenWidgets,
    isEditMode,
    setIsEditMode,
    isDialogOpen,
    setIsDialogOpen,
    toggleVisibility,
    moveUp,
    moveDown,
    handleDragEnd,
    handleGridDragEnd,
  };
}
