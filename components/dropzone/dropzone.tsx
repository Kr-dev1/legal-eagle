'use client';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/dropzone';
import { useState } from 'react';

interface FileUploadProps {
    onUpload: (files: File[]) => void;
    initialFiles?: File[];
    maxfiles?: number
}

const FileUpload: React.FC<FileUploadProps> = ({ maxfiles = 1, onUpload, initialFiles = [] }) => {
    const [files, setFiles] = useState<File[] | undefined>(initialFiles.length > 0 ? initialFiles : undefined);

    const handleDrop = (files: File[]) => {
        setFiles(files);
        onUpload(files);
    };

    return (
        <Dropzone
            className='md:min-w-2xl min-w-[100%]'
            maxSize={5242880}
            maxFiles={maxfiles}
            onDrop={handleDrop}
            onError={console.error}
            src={files}
        >
            <DropzoneEmptyState />
            <DropzoneContent />
        </Dropzone>
    );
};

export default FileUpload;
