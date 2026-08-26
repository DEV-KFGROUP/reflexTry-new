import { Metadata } from 'next';
import TrainingProgramsClient from './TrainingProgramsClient';
import { getCategoryMetadata } from '@/lib/seo-utils';

export async function generateMetadata(): Promise<Metadata> {
    return getCategoryMetadata('training-programs');
}

export default function TrainingPrograms() {
    return <TrainingProgramsClient />;
}
