'use client'
import { useState } from 'react'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import JobLatest from "@/components/JobLatest";
import JobViewModal from "@/modals/JobViewModal";
import ApplicationModal from "@/modals/ApplicationModal";
import toast from 'react-hot-toast';

export default function Home() {
    const [showJobViewModal, setShowJobViewModal] = useState(false);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [selectedJobForView, setSelectedJobForView] = useState(null);
    const [selectedJobForApplication, setSelectedJobForApplication] = useState(null);

    const handleViewJobDetails = (job) => {
        setSelectedJobForView(job);
        setShowJobViewModal(true);
    };

    const handleApplyToJob = (job) => {
        const authRaw = localStorage.getItem('auth');
        const auth = authRaw ? JSON.parse(authRaw) : null;
        if (!auth?.token) {
            // trigger navbar to open login
            if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth:open-login'));
            return;
        }
        setSelectedJobForApplication(job);
        setShowApplicationModal(true);
    };

    const closeJobViewModal = () => {
        setShowJobViewModal(false);
        setSelectedJobForView(null);
    };

    const closeApplicationModal = () => {
        setShowApplicationModal(false);
        setSelectedJobForApplication(null);
    };

    return (
        <div>
            <Hero />
            <JobLatest onViewDetails={handleViewJobDetails} onApply={handleApplyToJob} />
            <LatestProducts />
            <BestSelling />
            <OurSpecs />
            <Newsletter />

            {/* Job View Modal */}
            <JobViewModal
                job={selectedJobForView}
                isOpen={showJobViewModal}
                onClose={closeJobViewModal}
            />

            {/* Application Modal */}
            <ApplicationModal
                job={selectedJobForApplication}
                isOpen={showApplicationModal}
                onClose={closeApplicationModal}
            />
        </div>
    );
}
