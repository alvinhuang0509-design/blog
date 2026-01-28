import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import config from "@/config/config.json";

export async function GET(context) {
  const filterDrafts = ({ data, id }) => !data?.draft && !id.startsWith("-");

  // Fetch all collections
  const blog = await getCollection("blog", filterDrafts);
  const ai = await getCollection("ai", filterDrafts);
  const security = await getCollection("security", filterDrafts);
  const dailyLife = await getCollection("dailyLife", filterDrafts);

  // Helper function to format items for RSS
  // Note: We use post.id assuming slug is derived from it or handled by Astro
  const formatPost = (post, section) => ({
    title: post.data.title,
    pubDate: post.data.date ?? new Date(0),
    description: post.data.description,
    link: `/${section}/${post.id}`,
    author: post.data.author,
    categories: post.data.categories,
  });

  // Combine and sort all posts
  const allPosts = [
    ...blog.map((post) => formatPost(post, "blog")),
    ...ai.map((post) => formatPost(post, "ai")),
    ...security.map((post) => formatPost(post, "security")),
    ...dailyLife.map((post) => formatPost(post, "daily-life")),
  ].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return rss({
    title: config.site.title || "Lewin's Insight",
    description: config.metadata.meta_description || "A blog about AI, Security and Life.",
    site: context.site || config.site.base_url,
    items: allPosts,
    customData: `<language>zh-cn</language>`,
  });
}
