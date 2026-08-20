import React, { useState } from 'react';
import { ReportCategory } from '../types';
import { AlertCircle, Camera, MapPin, Upload, CheckCircle2, Sparkles } from 'lucide-react';

interface ReportWasteProblemViewProps {
  onReportSubmitted: (reportData: any) => void;
  onNavigate: (tab: string) => void;
}

export const ReportWasteProblemView: React.FC<ReportWasteProblemViewProps> = ({
  onReportSubmitted,
  onNavigate
}) => {
  const [category, setCategory] = useState<ReportCategory>('Overflowing Bin');
  const [locationName, setLocationName] = useState('Metro Plaza Civic Center');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const samplePhotos = [
    { title: 'Overflowing Bin', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80' },
    { title: 'Illegal Dumping', url: 'https://images.unsplash.com/photo-1611284446314-60a55ac0d494?auto=format&fit=crop&w=600&q=80' },
    { title: 'Damaged Bin', url: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=600&q=80' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          locationName,
          description: description || `Reported ${category} issue via WasteSense AI app.`,
          photoUrl: photoUrl || samplePhotos[0].url,
          lat: 37.7749 + (Math.random() * 0.02 - 0.01),
          lng: -122.4194 + (Math.random() * 0.02 - 0.01)
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedSuccess(true);
        onReportSubmitted(data.report);
      }
    } catch (err) {
      console.error('Error submitting report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="report-waste-container" className="max-w-2xl mx-auto py-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-bold">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>Citizen Issue Dispatch</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
          Report Waste Problem
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Earn +50 Eco Points for reporting overflowing bins, illegal dumping, or damaged municipal bins.
        </p>
      </div>

      {submittedSuccess ? (
        <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Report Verified & Submitted!
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Your report has been dispatched to the Municipality Admin & local Collection Truck drivers. You earned +50 Eco Points!
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setSubmittedSuccess(false);
                setDescription('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold"
            >
              Submit Another Report
            </button>
            <button
              onClick={() => onNavigate('citizen_dash')}
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          
          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Issue Category
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(['Overflowing Bin', 'Illegal Dumping', 'Uncollected Garbage', 'Damaged Bin'] as ReportCategory[]).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                    category === cat
                      ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Location / Address</span>
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. 450 Civic Center Blvd"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Problem Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Describe what you observed..."
            />
          </div>

          {/* Photo URL or Sample selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1">
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span>Attach Photo (Select Sample Photo or Enter Image URL)</span>
            </label>
            
            <div className="grid grid-cols-3 gap-2">
              {samplePhotos.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => setPhotoUrl(s.url)}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                    photoUrl === s.url ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <img src={s.url} alt={s.title} className="w-full h-16 object-cover" />
                  <p className="text-[10px] font-bold text-center py-1 bg-slate-900 text-white truncate">{s.title}</p>
                </div>
              ))}
            </div>

            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium outline-none"
              placeholder="Or paste photo URL..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Dispatching Report...' : 'Submit Citizen Report (+50 Points)'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
