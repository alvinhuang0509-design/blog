import { slugify } from "@/lib/utils/textConverter";

const taxonomyFilter = (posts: any[], name: string, key: string) =>
  posts.filter((post) =>
    (Array.isArray(post.data?.[name]) ? post.data[name] : [])
      .map((name: string) => slugify(name))
      .includes(key),
  );

export default taxonomyFilter;
