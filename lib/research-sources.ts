/** Background sources; these studies did not evaluate Reflextry. */
export const RESEARCH_SOURCES = {
    training: {
        title: 'Simons et al. (2016): Do “Brain-Training” Programs Work?',
        url: 'https://www.psychologicalscience.org/journals/pspi/1529100616661983/',
    },
    memory: {
        title: 'Cowan (2001): The magical number 4 in short-term memory',
        url: 'https://pubmed.ncbi.nlm.nih.gov/11515286/',
    },
    aging: {
        title: 'National Institute on Aging: Cognitive Health and Older Adults',
        url: 'https://www.nia.nih.gov/health/cognitive-health-and-older-adults',
    },
};

export function getArticleSources(slug: string) {
    if (slug === 'cognitive-aging-prevention') return [RESEARCH_SOURCES.aging, RESEARCH_SOURCES.training];
    if (/memory|n-back|chimp/.test(slug)) return [RESEARCH_SOURCES.memory, RESEARCH_SOURCES.training];
    return [RESEARCH_SOURCES.training];
}
