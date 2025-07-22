import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export function ImageVideoUploader() {
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (files.length + acceptedFiles.length > 5) return;
            setFiles((prev) => [...prev, ...acceptedFiles]);
        },
        [files],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
            'video/*': [],
        },
        multiple: true,
        maxFiles: 5,
    });

    const handleRemove = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <Card className="mx-auto w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="text-lg">Upload Gambar & Video</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="mb-4">
                    <div
                        {...getRootProps()}
                        className="cursor-pointer rounded-md border-2 border-dashed border-[#f59e0b] p-6 text-center transition hover:bg-blue-50"
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? <p>Drop file di sini...</p> : <p>Drag & drop atau klik untuk memilih file</p>}
                        <p className="mt-1 text-sm text-muted-foreground">Format: JPG, PNG, MP4 (max 5 file)</p>
                    </div>
                </div>

               
                {files.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {files.map((file, index) => (
                            <div key={index} className="relative rounded-md border p-1">
                                {file.type.startsWith('image/') ? (
                                    <img src={URL.createObjectURL(file)} alt={file.name} className="h-32 w-full rounded object-cover" />
                                ) : (
                                    <video src={URL.createObjectURL(file)} controls className="h-32 w-full rounded object-cover" />
                                )}
                                <Button size="icon" variant="destructive" className="absolute top-1 right-1" onClick={() => handleRemove(index)}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                <Button className="mt-6 w-full">Proses File</Button>
            </CardContent>
        </Card>
    );
}
