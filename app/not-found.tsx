import Link from 'next/link'
import FuzzyText from './blocks/TextAnimations/FuzzyText/FuzzyText'

export default function NotFound() {
    return (
        <div className="flex flex-col justify-center items-center h-screen px-4 text-center space-y-4">
            <FuzzyText baseIntensity={0.1} hoverIntensity={0.2} enableHover>
                404
            </FuzzyText>
            <FuzzyText baseIntensity={0.1} hoverIntensity={0.3} enableHover fontSize={40}>
                Page Not Found
            </FuzzyText>
            <p className="text-gray-500 max-w-md">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                href="/"
                className="mt-2 inline-block rounded border border-gray-300 bg-white px-5 py-2 text-gray-700 text-sm font-medium shadow-sm hover:bg-gray-100 transition"
            >
                Return to Homepage
            </Link>
        </div>
    )
}
