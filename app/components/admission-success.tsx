'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

interface AdmissionSuccessProps {
    applicationId: string;
    formData: any;
    onClose?: () => void;
}

export function AdmissionSuccess({ applicationId, formData, onClose }: AdmissionSuccessProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        setError(null);

        try {
            const response = await fetch('/api/admission/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    application_id: applicationId,
                    form_data: formData,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }

            // Get the PDF blob
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Admission_Slip_${applicationId}.pdf`;

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('PDF download error:', err);
            setError('Failed to download PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-neutral-200 my-8"
        >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="relative h-20 w-64">
                        <Image
                            src="/logo.webp"
                            alt="University of Lahore"
                            fill
                            className="object-contain brightness-0 invert"
                            priority
                        />
                    </div>
                </div>
                <p className="text-primary-foreground/80 font-medium">Admission Application Slip</p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-green-600 font-medium mb-1">Application Status</p>
                    <p className="text-xl font-bold text-green-700">Submitted Successfully</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                        <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Application ID</label>
                        <p className="text-lg font-mono font-bold mt-1 text-black">{applicationId}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Date</label>
                        <p className="text-lg font-medium mt-1 text-black">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="border-t border-neutral-200 pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-black">Applicant Details</h3>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <div className="col-span-2 md:col-span-1">
                            <label className="text-sm text-muted-foreground">Full Name</label>
                            <p className="font-medium text-black">{formData.full_name}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="text-sm text-muted-foreground">Father's Name</label>
                            <p className="font-medium text-black">{formData.father_name}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="text-sm text-muted-foreground">Email</label>
                            <p className="font-medium text-black">{formData.email}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="text-sm text-muted-foreground">Phone</label>
                            <p className="font-medium text-black">{formData.phone}</p>
                        </div>
                        <div className="col-span-2">
                            <label className="text-sm text-muted-foreground">Address</label>
                            <p className="font-medium text-black">{formData.address}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-200 pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-black">Program Details</h3>
                    <div className="bg-neutral-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-sm text-muted-foreground">Applied Program</label>
                                <p className="text-xl font-bold text-primary">{formData.program}</p>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Previous Degree</label>
                                <p className="font-medium text-black">{formData.previous_degree}</p>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Marks / Percentage</label>
                                <p className="font-medium text-black">{formData.marks_percentage}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-xs text-muted-foreground text-center pt-8">
                    <p>This is a computer-generated document. No signature is required.</p>
                    <p className="mt-1">Please bring this slip along with your original documents for the interview.</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="bg-neutral-50 p-6 flex justify-between items-center">
                <button
                    onClick={onClose}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    Start New Application
                </button>
                <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isDownloading ? (
                        <>
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating PDF...
                        </>
                    ) : (
                        <>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download PDF
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
}

