"use client";
import { useState } from 'react';
import SubscriptionModal from '../modals/SubscriptionModal';

const PricingSectionNew = () => {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Pricing Plans</h2>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          Choose the plan that fits your needs. Upgrade anytime to unlock premium features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Plan</h3>
          <p className="text-4xl font-bold text-gray-900 mb-5">Free</p>
          <ul className="space-y-3 text-sm text-gray-700 mb-6">
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#5c3aec' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              Basic access to job and investor listings
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#5c3aec' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              Browse scholarships and opportunities
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#5c3aec' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              Community support and resources
            </li>
          </ul>
          <button className="w-full py-2.5 rounded-lg bg-gray-200 text-gray-800 text-sm font-semibold cursor-default" disabled>
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="rounded-xl shadow-md p-6 text-white relative overflow-hidden" style={{ backgroundColor: '#5c3aec' }}>
          <div className="absolute top-3 right-3 bg-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide" style={{ color: '#5c3aec' }}>
            Pro
          </div>
          <h3 className="text-xl font-semibold mb-2">Pro Plan</h3>
          <p className="text-4xl font-bold mb-5">$4.99<span className="text-base font-normal">/month</span></p>
          <ul className="space-y-3 text-sm mb-6">
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              All Free Plan benefits
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              Priority access to investors
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              Exclusive scholarships and offers
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              Advanced analytics and insights
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              Premium 24/7 support
            </li>
          </ul>
          <button
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="w-full py-2.5 rounded-lg bg-white text-sm font-semibold hover:bg-gray-100 transition"
            style={{ color: '#5c3aec' }}
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </section>
  );
};

export default PricingSectionNew;