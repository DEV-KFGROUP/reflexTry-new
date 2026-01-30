export interface BaseContent {
    slug: string;
    title: string;
    description: string;
    publishedAt: string;
    updatedAt?: string;
    readingTime?: string;
}

export interface Article extends BaseContent {
    author: {
        name: string;
        image?: string;
    };
    category: string;
    tags: string[];
    image?: string;
    featured?: boolean;
}

export interface TestContent extends BaseContent {
    testType: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    instructions: string[];
    scoringMetric: string; // 'ms' | 'score' | 'accuracy'
}

export type ContentType = 'blog' | 'tests' | 'pages';
