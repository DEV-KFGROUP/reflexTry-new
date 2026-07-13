import { SEO_CONFIGS } from '../config/seo-config';
import { toolContent } from '../lib/tool-content';

const seoTools = Object.keys(SEO_CONFIGS);
const contentTools = Object.keys(toolContent);

const missing = seoTools.filter(tool => !contentTools.includes(tool));
console.log("Missing tools:", missing);
