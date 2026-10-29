'use client';

import { useState } from 'react';

interface AdmissionFormProps {
  initialData: {
    full_name: string;
    father_name: string;
    email: string;
    phone: string;
    program: string;
    previous_degree: string;
    marks_percentage: number;
    address: string;
  };
  onSubmit: (data: any) => void;
}

export function AdmissionForm({ initialData, onSubmit }: AdmissionFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 p-6 rounded-xl border shadow-sm" style={{ 
      background: 'var(--card)', 
      borderColor: 'var(--border)' 
    }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
        Review Application Form
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md text-sm border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
              Father's Name
            </label>
            <input
              type="text"
              name="father_name"
              value={formData.father_name || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md text-sm border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md text-sm border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="+92 300 1234567"
              className="w-full px-3 py-2 rounded-md text-sm border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
              Program Applied For
            </label>
            <input
              type="text"
              name="program"
              value={formData.program || ''}
              readOnly
              className="w-full px-3 py-2 rounded-md text-sm border bg-transparent opacity-70 cursor-not-allowed"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
              Previous Degree
            </label>
            <input
              type="text"
              name="previous_degree"
              value={formData.previous_degree || ''}
              readOnly
              className="w-full px-3 py-2 rounded-md text-sm border bg-transparent opacity-70 cursor-not-allowed"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
              Marks Percentage
            </label>
            <input
              type="text"
              name="marks_percentage"
              value={formData.marks_percentage ? `${formData.marks_percentage}%` : ''}
              readOnly
              className="w-full px-3 py-2 rounded-md text-sm border bg-transparent opacity-70 cursor-not-allowed"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md text-sm border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
        </div>
        
        <div className="pt-4 flex justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2"
            style={{ 
              background: 'var(--primary)', 
              color: 'var(--primary-foreground)' 
            }}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
