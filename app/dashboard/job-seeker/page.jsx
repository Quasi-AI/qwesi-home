"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { API_ROUTES } from '@/lib/apiRoutes'

const JobSeekerRegistration = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    userType: 'seeker',
    name: '',
    email: '',
    phone: '',
    goals: '',
    skills: '',
    experience: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = form.name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.goals.trim() !== '' &&
    form.skills.trim() !== '' &&
    form.experience.trim() !== '';

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_ROUTES.BASE_URL}/register-on-page`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Job seeker profile registered successfully!');
        setForm({
          userType: 'seeker',
          name: '',
          email: '',
          phone: '',
          goals: '',
          skills: '',
          experience: ''
        });
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Job Seeker Registration
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Create your profile to connect with employers and find your dream job.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-2">
              <h3 className="text-xl font-bold text-slate-800">Profile Details</h3>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': '#5c3aec' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': '#5c3aec' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Your phone number"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': '#5c3aec' }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Goals *</label>
              <textarea
                value={form.goals}
                onChange={(e) => handleChange('goals', e.target.value)}
                rows="4"
                placeholder="Describe your career goals"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:border-transparent resize-none transition-all duration-300"
                style={{ '--tw-ring-color': '#5c3aec' }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Skills *</label>
              <textarea
                value={form.skills}
                onChange={(e) => handleChange('skills', e.target.value)}
                rows="4"
                placeholder="List your skills separated by commas"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:border-transparent resize-none transition-all duration-300"
                style={{ '--tw-ring-color': '#5c3aec' }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Experience *</label>
              <textarea
                value={form.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                rows="4"
                placeholder="Describe your work experience"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:border-transparent resize-none transition-all duration-300"
                style={{ '--tw-ring-color': '#5c3aec' }}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-4 sm:mb-0">
                * Required fields. Your information will be kept confidential and used only for matching purposes.
              </p>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid}
                className="px-8 py-3 text-white rounded-xl font-medium hover:opacity-90 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                style={{ backgroundColor: '#5c3aec', '--tw-ring-color': '#5c3aec' }}
              >
                <span className="flex items-center justify-center">
                  {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobSeekerRegistration;