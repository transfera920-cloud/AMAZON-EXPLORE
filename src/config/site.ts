export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  basePath: string;
  canonicalBase: string;
  courseName: string;
  defaultOgImage: string;
  datePublished: string;
  dateModified: string;
  organization: {
    '@type': 'Organization';
    name: string;
    url: string;
    logo: string;
  };
}

export const SITE_CONFIG: SiteConfig = {
  siteName: '亞馬遜國家山岳協會',
  siteUrl: 'https://amazon-hike.com',
  basePath: '/chapter22',
  canonicalBase: 'https://amazon-hike.com/chapter22/',
  courseName: '進階探勘教育系統',
  defaultOgImage: 'https://amazon-hike.com/chapter22/og.png',
  datePublished: '2025-01-15T00:00:00+08:00',
  dateModified: '2025-02-01T00:00:00+08:00',
  organization: {
    '@type': 'Organization',
    name: '亞馬遜國家山岳協會',
    url: 'https://amazon-hike.com/',
    logo: 'https://amazon-hike.com/chapter22/og.png',
  },
};

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.organization.name,
    url: SITE_CONFIG.organization.url,
    logo: SITE_CONFIG.organization.logo,
  };
}

export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${SITE_CONFIG.courseName}｜${SITE_CONFIG.siteName}`,
    url: SITE_CONFIG.canonicalBase,
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.organization.name,
      url: SITE_CONFIG.organization.url,
    },
  };
}

export function generateCourseJsonLd(chapters: { no: number; id: string; title: string; subtitle: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: SITE_CONFIG.courseName,
    description: '以地形、植被、地質、水源、天氣與風險決策為主軸的進階登山探勘教案系統：12 章方法論、案例庫、判讀練習與能力分級診斷。',
    inLanguage: 'zh-TW',
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.organization.name,
      url: SITE_CONFIG.organization.url,
    },
    hasPart: chapters.map(ch => ({
      '@type': 'Course',
      name: `第${ch.no}章 ${ch.title}`,
      description: ch.subtitle,
      url: `${SITE_CONFIG.canonicalBase}curriculum/${ch.id}/`,
    })),
  };
}

export function generateChapterJsonLd(chapter: {
  no: number;
  id: string;
  title: string;
  subtitle: string;
  coreQuestion?: string;
}) {
  const canonicalUrl = `${SITE_CONFIG.canonicalBase}curriculum/${chapter.id}/`;
  const description = chapter.coreQuestion 
    ? `${chapter.subtitle}。${chapter.coreQuestion.slice(0, 100)}` 
    : chapter.subtitle;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `第${chapter.no}章 ${chapter.title}`,
      description: description,
      inLanguage: 'zh-TW',
      mainEntityOfPage: canonicalUrl,
      datePublished: SITE_CONFIG.datePublished,
      dateModified: SITE_CONFIG.dateModified,
      author: {
        '@type': 'Organization',
        name: SITE_CONFIG.organization.name,
        url: SITE_CONFIG.organization.url,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_CONFIG.organization.name,
        url: SITE_CONFIG.organization.url,
        logo: {
          '@type': 'ImageObject',
          url: SITE_CONFIG.defaultOgImage,
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: `第${chapter.no}章 ${chapter.title}`,
      description: description,
      inLanguage: 'zh-TW',
      learningResourceType: 'Lesson',
      position: chapter.no,
      isPartOf: {
        '@type': 'Course',
        name: SITE_CONFIG.courseName,
        url: `${SITE_CONFIG.canonicalBase}curriculum/`,
      },
      author: {
        '@type': 'Organization',
        name: SITE_CONFIG.organization.name,
        url: SITE_CONFIG.organization.url,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_CONFIG.organization.name,
        url: SITE_CONFIG.organization.url,
      },
    },
  ];
}
