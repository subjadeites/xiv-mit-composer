import type { MitEvent } from '../../model/types';
import { SKILLS } from '../../data/skills';
import { cn } from '../../utils';
// import { useState } from 'react'; // Unused

interface Props {
    mit: MitEvent;
    width: number; // exact pixel width
    className?: string;
    // We don't need drag handlers here, just visual
    isOverlay?: boolean;
}

export function MitigationBar({ mit, width, className, isOverlay }: Props) {
    const skill = SKILLS.find(s => s.id === mit.skillId);

    return (
        <div
            style={{ width }}
            className={cn(
                "rounded shadow-md border border-white/20 overflow-hidden flex items-center justify-center text-xs font-bold text-white relative h-full",
                skill?.color || 'bg-gray-500',
                className,
                isOverlay && "opacity-80 ring-2 ring-white z-50 shadow-xl"
            )}
        >
            <span className="truncate px-1">{skill?.name}</span>
        </div>
    );
}
