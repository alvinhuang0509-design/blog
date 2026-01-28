const getHotPosts = (posts: any[], limit: number = 10) => {
  const postsWithScore = posts.map((post) => {
    const views = post.data.views || 0;
    const comments = post.data.comments || 0;
    const score = views * 2 + comments * 5;
    
    return {
      ...post,
      score,
    };
  });

  const sortedByScore = postsWithScore.sort((a, b) => b.score - a.score);
  
  return sortedByScore.slice(0, limit);
};

export default getHotPosts;
