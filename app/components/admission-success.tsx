'use client';

import { motion } from 'motion/react';

interface AdmissionSuccessProps {
    applicationId: string;
    formData: any;
    onClose?: () => void;
}

export function AdmissionSuccess({ applicationId, formData, onClose }: AdmissionSuccessProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-neutral-200 my-8 print:shadow-none print:border-none print:my-0 print:w-full print:max-w-none"
        >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-8 text-center print:bg-white print:text-black print:border-b-2 print:border-black">
                <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-primary print:border-2 print:border-black">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-3xl font-bold mb-2">University of Lahore</h2>
                <p className="text-primary-foreground/80 print:text-black">Admission Application Slip</p>
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

                <div className="text-xs text-muted-foreground text-center pt-8 print:pt-16">
                    <p>This is a computer-generated document. No signature is required.</p>
                    <p className="mt-1">Please bring this slip along with your original documents for the interview.</p>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-neutral-50 p-6 flex justify-between items-center print:hidden">
                <button
                    onClick={onClose}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    Start New Application
                </button>
                <button
                    onClick={handlePrint}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download / Print
                </button>
            </div>
        </motion.div>
    );
}
