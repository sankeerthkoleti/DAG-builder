
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface StatusPanelProps {
  status: ValidationResult;
}

export const StatusPanel = ({ status }: StatusPanelProps) => {
  return (
    <div className="p-4 border-b">
      <h3 className="font-semibold mb-3 text-gray-900">DAG Validation</h3>
      
      <div className={cn(
        "flex items-center gap-2 p-3 rounded-md",
        status.isValid ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      )}>
        {status.isValid ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Valid DAG</span>
          </>
        ) : (
          <>
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Invalid DAG</span>
          </>
        )}
      </div>

      {status.errors.length > 0 && (
        <div className="mt-3 space-y-2">
          <h4 className="text-sm font-medium text-red-700 flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            Errors
          </h4>
          {status.errors.map((error, index) => (
            <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          ))}
        </div>
      )}

      {status.warnings.length > 0 && (
        <div className="mt-3 space-y-2">
          <h4 className="text-sm font-medium text-orange-700 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            Warnings
          </h4>
          {status.warnings.map((warning, index) => (
            <div key={index} className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
              {warning}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
