import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export function ImageVideoUploader({ id }: { id: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        comment: '',
        files: [] as File[],
        status: 'rejected',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            setData('files', Array.from(selectedFiles));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        post(route('feedback', id), {
            forceFormData: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    const onDrop = (acceptedFiles: File[]) => {
        // Maksimal 5 file
        if (data.files.length + acceptedFiles.length > 5) return;
        setData('files', [...data.files, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png'],
            'video/*': ['.mp4'],
        },
        maxSize: 2 * 1024 * 1024, // 2MB
        multiple: true,
    });

    const handleRemove = (index: number) => {
        const newFiles = [...data.files];
        newFiles.splice(index, 1);
        setData('files', newFiles);
    };

    return (
        <Card className="mx-auto w-full">
            <CardContent className="py-4">
                <form onSubmit={handleSubmit}>
                    <Textarea
                        value={data.comment}
                        onChange={(e) => setData('comment', e.target.value)}
                        placeholder="Apa keluhan dari produk kami yang Anda terima?"
                    />
                    {errors.comment && <p className="mt-1 text-sm text-red-500">{errors.comment}</p>}

                    <div className="my-4">
                        {data.files.length < 5 && (
                            <div
                                {...getRootProps()}
                                className="cursor-pointer rounded-md border-2 border-dashed border-[#f59e0b] p-6 text-center transition hover:bg-blue-50"
                            >
                                <input {...getInputProps()} />
                                {isDragActive ? <p>Drop file di sini...</p> : <p>Drag & drop atau klik untuk memilih dokumen</p>}
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Format: .jpg, .png, .mp4
                                    <br />
                                    (maks. 5 dokumen dan ukuran 2 MB)
                                </p>
                            </div>
                        )}
                    </div>

                    {data.files.length > 0 && (
                        <div className="my-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {data.files.map((file, index) => (
                                <div key={index} className="relative rounded-md border p-1">
                                    {file.type.startsWith('image/') ? (
                                        <img src={URL.createObjectURL(file)} alt={file.name} className="h-32 w-full rounded object-cover" />
                                    ) : (
                                        <video src={URL.createObjectURL(file)} controls className="h-32 w-full rounded object-cover" />
                                    )}
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="destructive"
                                        className="absolute top-1 right-1"
                                        onClick={() => handleRemove(index)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {errors.files && <p className="text-sm text-red-500">{errors.files}</p>}

                    <Button type="submit" className="w-full" disabled={processing}>
                        Kirim Komplain
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
