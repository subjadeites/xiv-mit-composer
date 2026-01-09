import { useDraggable } from '@dnd-kit/core';
// import { CSS } from '@dnd-kit/utilities';
import type { MitEvent } from '../../model/types';
import { useState, useEffect, useRef } from 'react';
import { MitigationBar } from './MitigationBar';
import { ContextMenu } from './ContextMenu';

interface Props {
    mit: MitEvent;
    left: number;
    width: number;
    onUpdate: (id: string, updates: Partial<MitEvent>) => void;
    onRemove: (id: string) => void;
    isEditing: boolean;
    onEditChange: (isEditing: boolean) => void;
}

export function DraggableMitigation({ mit, left, width, onUpdate, onRemove, isEditing, onEditChange }: Props) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: mit.id,
        data: { type: 'existing-mit', mit }
    });

    // The draggable item ITSELF is what we see in the timeline.
    // If we use DragOverlay, we need to hide this one while dragging, or let the overlay be the "clone".
    // For timeline adjustment, usually we DRAG the item itself horizontally.
    // If using Overlay, the item might disappear from timeline which looks weird for "moving".
    // BUT dnd-kit recommends Overlay for everything.
    // Let's rely on Overlay for consistency.

    const style = {
        left: left,
        width: width,
        position: 'absolute' as const,
        height: '100%',
        top: 0,
        pointerEvents: 'auto' as const
    };

    const [editValue, setEditValue] = useState((mit.tStartMs / 1000).toFixed(1));
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

    // 当进入编辑模式时，同步当前时间
    useEffect(() => {
        if (isEditing) {
            setEditValue((mit.tStartMs / 1000).toFixed(1));
        }
    }, [isEditing, mit.tStartMs]);

    const handleEditSubmit = () => {
        onEditChange(false);
        const val = parseFloat(editValue);
        if (!isNaN(val)) {
            onUpdate(mit.id, {
                tStartMs: val * 1000,
                tEndMs: (val * 1000) + mit.durationMs
            });
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    const handleEditClick = () => {
        setContextMenu(null);
        onEditChange(true);
    };

    const handleRemoveClick = () => {
        setContextMenu(null);
        onRemove(mit.id);
    };

    const handleContextMenuClose = () => {
        setContextMenu(null);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group"
            onContextMenu={handleContextMenu}
        >
            <div
                {...attributes}
                {...listeners}
                className={isDragging ? 'opacity-0' : 'h-full w-full'}
            >
                {!isDragging && <MitigationBar mit={mit} width={width} />}
            </div>

            {/* Context menu for editing */}
            {!isDragging && contextMenu && (
                <ContextMenu
                    items={[
                        {
                            label: '编辑事件',
                            onClick: handleEditClick
                        },
                        {
                            label: '删除事件',
                            onClick: handleRemoveClick,
                            danger: true
                        }
                    ]}
                    position={contextMenu}
                    onClose={handleContextMenuClose}
                />
            )}

            {/* Edit form when in edit mode */}
            {!isDragging && isEditing && (
                <div
                    className="absolute top-full mt-1 left-0 bg-gray-800 border border-gray-600 p-3 rounded z-[100] w-auto min-w-[140px] shadow-xl flex flex-col gap-2"
                    onPointerDown={e => e.stopPropagation()}
                >
                    <label className="text-xs text-gray-400 font-bold">编辑事件</label>

                    <div className="flex items-center gap-2">
                        <label className="text-[10px] text-gray-500 whitespace-nowrap">开始(s):</label>
                        <input
                            autoFocus
                            className="w-16 bg-gray-700 border border-gray-500 rounded text-xs px-2 py-1 text-white focus:border-blue-500 outline-none"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleEditSubmit()}
                        />
                    </div>

                    <div className="flex justify-between items-center mt-1 border-t border-gray-700 pt-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(mit.id);
                            }}
                            className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-red-900/30 transition-colors"
                        >
                            <span>🗑️</span> 删除
                        </button>

                        <button
                            onClick={handleEditSubmit}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded transition-colors"
                        >
                            确定
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
