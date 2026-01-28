import React, { useState } from "react";
import { FaRegSmile, FaRegImage, FaPaperPlane } from "react-icons/fa";

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: Date;
  replies?: Comment[];
  image?: string;
}

const CommentSystem = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "张三",
      content: "这篇文章写得很好，学到了很多新知识！",
      date: new Date("2024-01-15"),
      replies: [
        {
          id: "1-1",
          author: "李四",
          content: "同意！特别是关于AI安全的部分分析很到位。",
          date: new Date("2024-01-15"),
        },
      ],
    },
    {
      id: "2",
      author: "王五",
      content: "期待更多这样的深度内容，继续保持！",
      date: new Date("2024-01-16"),
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = [
    "😀",
    "😂",
    "😄",
    "😅",
    "😆",
    "😉",
    "😊",
    "😍",
    "😘",
    "😎",
    "🤔",
    "😱",
    "👍",
    "❤️",
  ];

  const handleReply = (commentId: string) => {
    setReplyTo(commentId);
    setShowEmojiPicker(false);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: "Lewin",
      content: newComment,
      date: new Date(),
    };

    if (replyTo) {
      const addReplyToParent = (comments: Comment[]): Comment[] => {
        return comments.map((c) => {
          if (c.id === replyTo) {
            return {
              ...c,
              replies: [...(c.replies || []), comment],
            };
          }
          return c;
        });
      };
      setComments(addReplyToParent(comments));
    } else {
      setComments([comment, ...comments]);
    }

    setNewComment("");
    setReplyTo(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewComment((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "今天";
    if (days === 1) return "昨天";
    if (days < 7) return `${days}天前`;
    if (days < 30) return `${Math.floor(days / 7)}周前`;
    return `${Math.floor(days / 30)}月前`;
  };

  return (
    <div className="comments-section">
      <h3 className="mb-8 text-2xl font-bold">评论 ({comments.length})</h3>

      {/* 新评论表单 */}
      <div className="mb-8 rounded-lg bg-light p-6 dark:bg-darkmode-light">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="comment-input"
              className="mb-2 block font-semibold"
            >
              {replyTo ? "回复评论" : "发表评论"}
            </label>
            <textarea
              id="comment-input"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="分享你的想法..."
              className="w-full rounded border border-border p-4 dark:border-darkmode-border dark:bg-darkmode-body dark:text-white"
              rows={4}
              aria-label="评论内容"
            />
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex items-center space-x-1 rounded bg-white px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:bg-darkmode-body dark:hover:bg-darkmode-light"
                  aria-label="选择表情"
                >
                  <FaRegSmile className="h-5 w-5" />
                  <span>表情</span>
                </button>

                {showEmojiPicker && (
                  <div className="absolute left-0 top-12 z-10 rounded-lg border border-border bg-white p-3 shadow-lg dark:border-darkmode-border dark:bg-darkmode-body">
                    <div className="grid grid-cols-7 gap-2">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className="text-2xl transition-transform hover:scale-110"
                          aria-label={`选择表情${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="flex items-center space-x-1 rounded bg-white px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:bg-darkmode-body dark:hover:bg-darkmode-light"
                aria-label="上传图片"
              >
                <FaRegImage className="h-5 w-5" />
                <span>图片</span>
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!newComment.trim()}
              aria-label="发表评论"
            >
              <FaPaperPlane className="mr-2 -mt-1 inline-block" />
              发表评论
            </button>
          </div>

          {replyTo && (
            <button
              type="button"
              onClick={handleCancelReply}
              className="text-sm transition-colors hover:text-primary text-text-light dark:text-darkmode-text-light dark:hover:text-darkmode-primary"
            >
              取消回复
            </button>
          )}
        </form>
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  {comment.author.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-2">
                  <span className="font-semibold text-text-dark dark:text-white">
                    {comment.author}
                  </span>
                  <span className="ml-2 text-sm text-text-light dark:text-darkmode-text-light">
                    {formatDate(comment.date)}
                  </span>
                </div>

                <p className="mb-4 text-text dark:text-darkmode-text">
                  {comment.content}
                </p>

                <button
                  onClick={() => handleReply(comment.id)}
                  className="text-sm transition-colors hover:text-primary text-primary dark:text-darkmode-primary dark:hover:text-darkmode-primary"
                  aria-label={`回复${comment.author}的评论`}
                >
                  回复
                </button>

                {/* 嵌套回复 */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-4 border-l-2 border-border pl-4 dark:border-darkmode-border">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-light font-semibold text-text-dark dark:bg-darkmode-body dark:text-white">
                            {reply.author.charAt(0).toUpperCase()}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="mb-2">
                            <span className="font-semibold text-text-dark dark:text-white">
                              {reply.author}
                            </span>
                            <span className="ml-2 text-sm text-text-light dark:text-darkmode-text-light">
                              {formatDate(reply.date)}
                            </span>
                          </div>

                          <p className="text-text dark:text-darkmode-text">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSystem;
