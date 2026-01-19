'use client';

import { useState } from 'react';

export default function ListingGenerator() {
    const [file, setFile] = useState<File | null>(null);
    const [platform, setPlatform] = useState<'Shopee' | 'Tokopedia' | 'TikTok'>('Shopee');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleGenerate = async (isMock: boolean = false) => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('platform', platform);
        formData.append('useMock', isMock.toString());

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Generation failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Failed to generate listing');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!result) return;

        try {
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: result.title,
                    description: result.description,
                    hashtags: result.hashtags,
                    platform: platform,
                }),
            });

            if (!response.ok) throw new Error('Failed to save to database');

            alert('Listing saved successfully!');
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save listing');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Listing Generator</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Platform
                    </label>
                    <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value as any)}
                        className="w-full p-2 border rounded-md bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700"
                    >
                        <option value="Shopee">Shopee</option>
                        <option value="Tokopedia">Tokopedia</option>
                        <option value="TikTok">TikTok</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
            "
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => handleGenerate(false)}
                        disabled={!file || loading}
                        className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition-colors
            ${!file || loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                            }`}
                    >
                        {loading ? 'Analyzing...' : 'Generate Listing'}
                    </button>

                    <button
                        onClick={() => handleGenerate(true)}
                        disabled={!file || loading}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors border border-gray-300 dark:border-zinc-600
            ${!file || loading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600'
                                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800'
                            }`}
                    >
                        Test Mock
                    </button>
                </div>

                {result && (
                    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Title</h3>
                            <p className="text-gray-700 dark:text-gray-300">{result.title}</p>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{result.description}</p>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Hashtags</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.hashtags.map((tag: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Save to Database
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
