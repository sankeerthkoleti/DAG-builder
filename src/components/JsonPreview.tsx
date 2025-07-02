import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Code, Copy, Check } from 'lucide-react';
import { Node, Edge } from '@xyflow/react';
import { cn } from '@/lib/utils';

interface JsonPreviewProps {
  nodes: Node[];
  edges: Edge[];
}

export const JsonPreview = ({ nodes, edges }: JsonPreviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const dagData = {
    nodes: nodes.map(node => ({
      id: node.id,
      label: node.data.label,
      position: node.position,
    })),
    edges: edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    })),
  };

  const jsonString = JSON.stringify(dagData, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="p-4 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Code className="w-4 h-4" />
          JSON Preview
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>
      
      <div className={cn(
        "bg-gray-900 text-green-400 text-xs font-mono p-3 rounded overflow-auto transition-all",
        isExpanded ? "flex-1" : "max-h-32"
      )}>
        <pre>{jsonString}</pre>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Nodes: {nodes.length} | Edges: {edges.length}
      </div>
    </div>
  );
};
