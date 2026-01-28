import config from "@/config/config.json";
import { DiscussionEmbed } from "disqus-react";
import React from "react";

type Props = {
  className?: string;
  identifier: string;
  title: string;
  url: string;
};

const Disqus = ({ className, identifier, title, url }: Props) => {
  const { disqus } = config;
  const isConfigured = disqus.enable && Boolean(disqus.shortname);

  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    if (!isConfigured) return;
    setEnabled(localStorage.getItem("comments:disqus") === "1");
  }, [isConfigured]);

  return (
    <div className={className}>
      {!isConfigured ? null : enabled ? (
        <DiscussionEmbed
          shortname={disqus.shortname}
          config={{
            ...(disqus.settings || {}),
            identifier,
            title,
            url,
          }}
        />
      ) : (
        <div className="rounded-lg border border-border bg-light p-6 dark:border-darkmode-border dark:bg-darkmode-light">
          <p className="mb-3 font-semibold text-text-dark dark:text-darkmode-text-dark">
            评论区（Disqus）
          </p>
          <p className="mb-4 text-sm text-text-light dark:text-darkmode-text-light">
            点击加载后将向 Disqus 发起网络请求，可能会设置第三方 Cookie。
          </p>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => {
              localStorage.setItem("comments:disqus", "1");
              setEnabled(true);
            }}
          >
            加载评论
          </button>
        </div>
      )}
    </div>
  );
};

export default Disqus;
