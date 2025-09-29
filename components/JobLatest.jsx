'use client'
import React, { useEffect, useState } from 'react'
import Title from './Title'
import JobCard from './JobCard'
import LoaderSkeleton from './SkeletonLoader'

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com'

const LatestJobs = ({ displayQuantity = 4, sector = null, location = null, country= null, limit= 4, onViewDetails, onApply }) => {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [meta, setMeta] = useState({ showing: 0, total: 0, limit: displayQuantity })

    useEffect(() => {
        const fetchLatestJobs = async () => {
            try {
                setLoading(true)
                setError(null)

                // Build query parameters
                const params = new URLSearchParams({
                    limit: displayQuantity.toString(),
                    sortBy: 'newest'
                })

                if (displayQuantity){
                   params.append('limit', displayQuantity) 
                }
                
                if (sector) {
                    params.append('sector', sector)
                }
                
                if (location) {
                    params.append('location', location)
                }

                const response = await fetch(`${API_BASE_URL}/getalljobsHome?${params}`)
                
                if (response.ok) {
                    const result = await response.json()
                    
                    if (result.success || result.data) {
                        const jobsData = result.data || []
                        setJobs(jobsData)
                        setMeta({
                            showing: jobsData.length,
                            total: result.total || jobsData.length,
                            limit: displayQuantity
                        })
                    } else {
                        throw new Error(result.message || 'Failed to fetch jobs')
                    }
                } else {
                    throw new Error(`HTTP ${response.status}: Failed to fetch jobs`)
                }

            } catch (error) {
                console.error('Error fetching latest jobs:', error)
                setError(error.message)
                setJobs([])
                setMeta({ showing: 0, total: 0, limit: displayQuantity })
            } finally {
                setLoading(false)
            }
        }

        fetchLatestJobs()
    }, [displayQuantity, sector, location])

    if (loading) {
        return (
            <div className='px-6 my-30 max-w-6xl mx-auto'>
                <Title 
                    title='Latest Job Opportunities' 
                    description='Loading jobs...' 
                    href='/jobs' 
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: displayQuantity }).map((_, index) => (
                        <LoaderSkeleton key={index} />
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='px-6 my-30 max-w-6xl mx-auto'>
                <Title 
                    title='Latest Job Opportunities' 
                    description='Failed to load jobs' 
                    href='/jobs' 
                />
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <div className="text-red-600 mb-2">⚠️ Error Loading Jobs</div>
                    <p className="text-red-700 text-sm mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title 
                title='Latest Job Opportunities' 
                description={`Showing ${meta.showing} of ${meta.total} career opportunities`} 
                href='/jobs' 
            />
            
            {jobs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {jobs.map(job => (
                        <JobCard
                            key={job._id || job.id}
                            job={job}
                            onViewDetails={onViewDetails}
                            onApply={onApply}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">💼</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Found</h3>
                    <p className="text-gray-500">
                        {sector || location 
                            ? `No jobs available for the specified ${sector ? 'sector' : 'location'}.` 
                            : 'No job opportunities are currently available.'
                        }
                    </p>
                </div>
            )}
        </div>
    )
}

export default LatestJobs