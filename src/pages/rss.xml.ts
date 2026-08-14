import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (
    await getCollection('blog', ({ data }) => !data.draft)
  ).sort(
    (a, b) =>
      new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
  );

  return rss({
    title: 'Alex Ye Lab',
    description:
      'Alex Ye 关于人工智能、大语言模型、软件工程与计算机系统的技术文章和学习笔记。',
    site: context.site ?? 'https://alexyelab.com',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.pubDate),
      link: `/blog/${post.id}`,
    })),
    customData: '<language>zh-CN</language>',
  });
}
