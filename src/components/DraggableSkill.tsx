import { useDraggable } from '@dnd-kit/core';
import type { Skill } from '../model/types';
import { SkillCard } from './SkillCard';
import { cn } from '../utils';

interface Props {
    skill: Skill;
}

export function DraggableSkill({ skill }: Props) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `new-${skill.id}`, // 与减伤事件区分的唯一 ID
        data: { type: 'new-skill', skill }
    });

    // When using DragOverlay, we don't need to transform the original element usually, 
    // unless we want it to move temporarily? 
    // Actually, normally we want the original to stay or dim, and overlay to follow cursor.
    // If not using overlay, we use transform.
    // But we ARE adding overlay now. So let's keep the original "ghosted" if dragging?

    // For proper Overlay support, the original item should NOT follow the cursor if we render the overlay.
    // The overlay follows the cursor.
    // So we remove 'transform' from here IF we assume App handles Overlay.
    // BUT, let's keep it robust: if we don't use overlay in App, this works. 
    // If we use overlay, we can conditionally apply style?

    // Standard pattern: 
    // If isDragging, maybe hide this one or lower opacity?

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={cn("touch-none", isDragging ? 'opacity-30' : '')}
        >
            <SkillCard skill={skill} />
        </div>
    );
}
