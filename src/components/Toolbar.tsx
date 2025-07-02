
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, LayoutGrid, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ToolbarProps {
  onAddNode: (name: string) => void;
  onAutoLayout: () => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
}

export const Toolbar = ({ onAddNode, onAutoLayout, onDeleteSelected, hasSelection }: ToolbarProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nodeName, setNodeName] = useState('');

  const handleAddNode = () => {
    if (!nodeName.trim()) {
      toast.error('Please enter a node name');
      return;
    }
    onAddNode(nodeName.trim());
    setNodeName('');
    setIsDialogOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddNode();
    }
  };

  return (
    <div className="bg-white border-b p-4 flex items-center gap-4">
      <h1 className="text-xl font-bold text-gray-900">Pipeline Editor</h1>
      
      <div className="flex items-center gap-2 ml-auto">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Node
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Node</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter node name"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddNode}>
                  Add Node
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={onAutoLayout} className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4" />
          Auto Layout
        </Button>

        <Button 
          variant="destructive" 
          onClick={onDeleteSelected}
          disabled={!hasSelection}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Selected
        </Button>
      </div>
    </div>
  );
};
