import React from 'react'
import Title from './Title'
import { Briefcase, DollarSign, GraduationCap, Users } from 'lucide-react'

const OurSpecs = () => {

    const ourSpecsData = [
        {
            title: 'Job Opportunities',
            description: 'Discover thousands of job listings across various industries. Connect with top employers and find your dream career in Ghana.',
            icon: Briefcase,
            accent: '#5C3AEB'
        },
        {
            title: 'Investor Network',
            description: 'Connect with investors ready to fund your business ideas. Get access to venture capital and angel investors.',
            icon: DollarSign,
            accent: '#10B981'
        },
        {
            title: 'Scholarships',
            description: 'Access exclusive scholarship opportunities for local and international studies. Fund your education dreams.',
            icon: GraduationCap,
            accent: '#F59E0B'
        },
        {
            title: 'Talent Pool',
            description: 'Showcase your skills and get discovered by employers. Join a community of talented professionals and freelancers.',
            icon: Users,
            accent: '#06B6D4'
        }
    ]

    return (
        <div className='px-4 sm:px-6 my-16 sm:my-20 max-w-6xl mx-auto'>
            <Title 
                visibleButton={false} 
                title='Why Choose Our Platform' 
                description="We connect talent with opportunities. Whether you're seeking jobs, investors, scholarships, or looking to showcase your skills, we've got you covered." 
            />

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 mt-10 sm:mt-12'>
                {
                    ourSpecsData.map((spec, index) => {
                        return (
                            <div 
                                className='relative h-48 sm:h-44 px-6 sm:px-8 flex flex-col items-center justify-center w-full text-center border rounded-lg group hover:shadow-lg transition-all duration-300' 
                                style={{ 
                                    backgroundColor: spec.accent + '10', 
                                    borderColor: spec.accent + '30' 
                                }} 
                                key={index}
                            >
                                <h3 className='text-slate-800 font-semibold text-base sm:text-lg'>{spec.title}</h3>
                                <p className='text-xs sm:text-sm text-slate-600 mt-2 sm:mt-3 leading-relaxed'>{spec.description}</p>
                                <div 
                                    className='absolute -top-4 sm:-top-5 text-white size-9 sm:size-10 flex items-center justify-center rounded-md group-hover:scale-105 transition-transform duration-200' 
                                    style={{ backgroundColor: spec.accent }}
                                >
                                    <spec.icon size={18} className="sm:w-5 sm:h-5" />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default OurSpecs