import React, { useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa";

const Favorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (postId: string) => {
    if (favorites.includes(postId)) {
      setFavorites(favorites.filter((id) => id !== postId));
    } else {
      setFavorites([...favorites, postId]);
    }
  };

  return (
    <div className="favorites-widget mb-8 rounded-lg bg-light p-6 dark:bg-darkmode-light">
      <h4 className="mb-4 font-bold text-text-dark dark:text-white">我的收藏</h4>
      {
        favorites.length > 0 ? (
          <ul className="space-y-3">
            {
              favorites.map((postId) => (
                <li
                  key={postId}
                  className="flex items-center justify-between rounded bg-white p-3 dark:bg-darkmode-body"
                >
                  <span className="text-text dark:text-darkmode-text">
                    文章 #{postId}
                  </span>
                  <button
                    onClick={() => toggleFavorite(postId)}
                    className="transition-colors hover:text-red-600 text-red-500"
                    aria-label="取消收藏"
                  >
                    <FaBookmark className="h-5 w-5" />
                  </button>
                </li>
              ))
            }
          </ul>
        ) : (
          <p className="py-4 text-center text-text-light dark:text-darkmode-text-light">
            暂无收藏文章
          </p>
        )
      }
    </div>
  );
};

export default Favorites;
