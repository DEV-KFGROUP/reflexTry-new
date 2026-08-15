import { Metadata } from 'next';
import TrainingProgramsClient from './TrainingProgramsClient';
import { getBaseUrl } from '@/lib/base-url';

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = getBaseUrl();

    return {
        title: 'Brain Training Programs | Structured Cognitive Training Plans - Reflextry',
        description: 'Follow our evidence-based brain training programs designed for specific goals. Structured schedules for memory improvement, reaction time, gaming performance, and senior brain health.',
        keywords: ['brain training programs', 'cognitive training plan', 'memory training program', 'reaction time training', 'gaming training program', 'structured brain training'],
        alternates: {
            canonical: `${baseUrl}/training-programs`,
        },
        openGraph: {
            title: 'Brain Training Programs | Reflextry',
            description: 'Structured training programs for memory, speed, gaming, and cognitive health.',
            url: `${baseUrl}/training-programs`,
            type: 'website',
        },
    };
}

export default function TrainingPrograms() {
    return <TrainingProgramsClient />;
}
