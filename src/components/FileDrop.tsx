import React, { useRef } from 'react';
import { Upload, FileText, Trash2, AlertCircle } from 'lucide-react';

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export interface FileDropProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSizeMb?: number;
  error?: string;
}

export const FileDrop: React.FC<FileDropProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSizeMb = 5,
  error
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = [...files];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (newFiles.length >= maxFiles) break;

      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a PDF, JPG, or PNG file.`);
        continue;
      }

      if (file.size > maxSizeMb * 1024 * 1024) {
        alert(`${file.name} exceeds the ${maxSizeMb}MB size limit.`);
        continue;
      }

      newFiles.push({
        name: file.name,
        size: file.size,
        type: file.type
      });
    }

    onFilesChange(newFiles);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full flex flex-col gap-2 text-left">
      <label className="text-sm font-semibold text-ink">
        Supporting documents (optional)
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFileSelect(e.dataTransfer.files);
        }}
        className="min-h-[110px] p-6 border-2 border-dashed border-line hover:border-navy rounded bg-surface text-center flex flex-col items-center justify-center cursor-pointer transition-colors focus-within:outline focus-within:outline-3 focus-within:outline-focus"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-label="Upload supporting documents"
      >
        <Upload className="w-6 h-6 text-muted mb-2" aria-hidden="true" />
        <p className="text-sm font-medium text-ink">
          Click to upload or drag and drop files here
        </p>
        <p className="text-xs text-muted mt-1">
          PDF, JPG, PNG up to {maxSizeMb} MB each (max {maxFiles} files)
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-sm text-[#B3321F] mt-1" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <ul className="mt-2 divide-y divide-line border border-line rounded bg-surface" aria-label="Attached files">
          {files.map((file, idx) => (
            <li key={idx} className="flex items-center justify-between p-3 text-sm">
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-4 h-4 text-navy shrink-0" aria-hidden="true" />
                <span className="font-medium text-ink truncate">{file.name}</span>
                <span className="text-xs text-muted tabular-nums shrink-0">
                  ({formatFileSize(file.size)})
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
                className="text-muted hover:text-[#B3321F] p-1 rounded focus-visible:outline focus-visible:outline-3 focus-visible:outline-focus"
                aria-label={`Remove file ${file.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
