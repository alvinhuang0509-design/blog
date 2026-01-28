import { getCollection } from "astro:content";

type SearchItem = {
  group: string;
  slug: string;
  frontmatter: {
    title: string;
    image?: string;
    description?: string;
    categories?: string[];
    tags?: string[];
  };
  content: string;
};

export async function GET() {
  const filterDrafts = ({ data, id }: { data: any; id: string }) =>
    !data?.draft && !id.startsWith("-");

  const [blog, ai, security, dailyLife] = await Promise.all([
    getCollection("blog", filterDrafts),
    getCollection("ai", filterDrafts),
    getCollection("security", filterDrafts),
    getCollection("dailyLife", filterDrafts),
  ]);

  const items: SearchItem[] = [
    ...blog.map((post) => ({
      group: "blog",
      slug: `blog/${post.id}`,
      frontmatter: {
        title: post.data.title,
        image: post.data.image,
        description: post.data.description,
        categories: post.data.categories,
        tags: post.data.tags,
      },
      content: post.body ?? "",
    })),
    ...ai.map((post) => ({
      group: "ai",
      slug: `ai/${post.id}`,
      frontmatter: {
        title: post.data.title,
        image: post.data.image,
        description: post.data.description,
        categories: post.data.categories,
        tags: post.data.tags,
      },
      content: post.body ?? "",
    })),
    ...security.map((post) => ({
      group: "security",
      slug: `security/${post.id}`,
      frontmatter: {
        title: post.data.title,
        image: post.data.image,
        description: post.data.description,
        categories: post.data.categories,
        tags: post.data.tags,
      },
      content: post.body ?? "",
    })),
    ...dailyLife.map((post) => ({
      group: "daily-life",
      slug: `daily-life/${post.id}`,
      frontmatter: {
        title: post.data.title,
        image: post.data.image,
        description: post.data.description,
        categories: post.data.categories,
        tags: post.data.tags,
      },
      content: post.body ?? "",
    })),
  ];

  return new Response(JSON.stringify(items), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

