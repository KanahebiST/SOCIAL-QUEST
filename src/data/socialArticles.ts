import { SocialArticle } from '../types';

// 手動登録データ。将来はRSS/APIのレスポンスをこの型へ変換して差し替える。
export const SOCIAL_ARTICLES: SocialArticle[] = [
  {
    id: 'article-sdg-overview',
    title: '持続可能な開発目標（SDGs）について',
    url: 'https://www.un.org/sustainabledevelopment/sustainable-development-goals/',
    source: '国際連合',
    category: 'learning',
    summary: '世界共通の17の目標から、社会課題の全体像を知る。',
    publishedAt: '常設記事',
    missionId: 'mis_daily_3',
  },
  {
    id: 'article-climate-action',
    title: '気候変動への対策を知る',
    url: 'https://www.un.org/en/climatechange/what-is-climate-change',
    source: '国際連合',
    category: 'environment',
    summary: '気候変動の原因と、私たちにできる行動を学ぶ。',
    publishedAt: '常設記事',
    missionId: 'mis_daily_3',
  },
];