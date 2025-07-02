
import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

export const PipelineNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={cn(
      "px-4 py-2 shadow-md rounded-md bg-white border-2 min-w-[120px]",
      selected ? "border-blue-500" : "border-gray-200",
      "hover:shadow-lg transition-shadow"
    )}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      
      <div className="text-sm font-medium text-gray-900 text-center">
        {data.label}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </div>
  );
});

PipelineNode.displayName = 'PipelineNode';
