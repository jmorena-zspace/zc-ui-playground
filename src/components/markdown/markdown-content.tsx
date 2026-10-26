import clsx from 'clsx';
import { FC, useMemo } from 'react';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownContentProps = {
  children: string;
  /** Maps an image `src` written in the markdown to a URL the browser can load. */
  resolveImage?: (src: string) => string;
  className?: string;
};

/**
 * Renders GitHub-flavored markdown (tables, task lists, strikethrough) with
 * this app's tokens. Elements are styled one by one rather than through a
 * typography plugin, so spacing and color stay on the same scale as the rest
 * of the UI.
 */
export const MarkdownContent: FC<MarkdownContentProps> = ({
  children,
  resolveImage = (src) => src,
  className,
}) => {
  const components = useMemo<Components>(
    () => ({
      h1: ({ node: _node, ...props }) => (
        <h1
          {...props}
          className="font-display text-display-xs text-content-primary"
        />
      ),
      h2: ({ node: _node, ...props }) => (
        <h2
          {...props}
          className="mt-sm text-body-lg font-medium text-content-primary"
        />
      ),
      h3: ({ node: _node, ...props }) => (
        <h3
          {...props}
          className="text-body-md font-medium text-content-primary"
        />
      ),
      p: ({ node, children: content, ...props }) => {
        const first = node?.children[0];
        const isImageOnly =
          node?.children.length === 1 &&
          first?.type === 'element' &&
          first.tagName === 'img';
        // A <figure> can't live inside a <p>, so a paragraph that is only an
        // image drops its wrapper.
        if (isImageOnly) return <>{content}</>;
        return (
          <p
            {...props}
            className="text-body-md leading-body-md text-content-secondary"
          >
            {content}
          </p>
        );
      },
      img: ({ node: _node, src, alt }) => (
        <figure className="flex flex-col gap-xs">
          <img
            src={resolveImage(typeof src === 'string' ? src : '')}
            alt={alt}
            className="w-full rounded-sm border border-border-system-subtle bg-bg-surface-subtle p-sm"
          />
          {alt && (
            <figcaption className="text-body-sm text-content-tertiary">
              {alt}
            </figcaption>
          )}
        </figure>
      ),
      ul: ({ node: _node, className: listClass, ...props }) => (
        <ul
          {...props}
          className={clsx(
            'flex flex-col gap-xxs text-body-md text-content-secondary',
            listClass?.includes('contains-task-list')
              ? 'list-none pl-0'
              : 'list-disc pl-lg marker:text-content-tertiary'
          )}
        />
      ),
      ol: ({ node: _node, ...props }) => (
        <ol
          {...props}
          className="flex list-decimal flex-col gap-xxs pl-lg text-body-md text-content-secondary marker:text-content-tertiary"
        />
      ),
      input: ({ node: _node, ...props }) => (
        <input {...props} className="mr-xs h-3.5 w-3.5 align-middle accent-z-blue-400" />
      ),
      table: ({ node: _node, ...props }) => (
        <div className="overflow-x-auto rounded-sm border border-border-system-subtle">
          <table {...props} className="w-full border-collapse text-left" />
        </div>
      ),
      thead: ({ node: _node, ...props }) => (
        <thead {...props} className="bg-bg-surface-subtle" />
      ),
      tbody: ({ node: _node, ...props }) => (
        <tbody {...props} className="[&_tr:last-child_td]:border-b-0" />
      ),
      th: ({ node: _node, ...props }) => (
        <th
          {...props}
          className="border-b border-border-system-subtle px-sm py-xs text-body-sm font-medium text-content-primary"
        />
      ),
      td: ({ node: _node, ...props }) => (
        <td
          {...props}
          className="border-b border-border-system-subtle px-sm py-xs text-body-md text-content-secondary"
        />
      ),
      blockquote: ({ node: _node, ...props }) => (
        <blockquote
          {...props}
          className="flex flex-col gap-xs rounded-sm border border-border-system-subtle bg-bg-surface-subtle p-md [&_p]:text-content-primary"
        />
      ),
      hr: ({ node: _node, ...props }) => (
        <hr {...props} className="border-border-system-subtle" />
      ),
      strong: ({ node: _node, ...props }) => (
        <strong {...props} className="font-medium text-content-primary" />
      ),
      code: ({ node: _node, ...props }) => (
        <code
          {...props}
          className="rounded-xs bg-bg-surface-strong px-xxs font-mono text-body-sm text-content-primary"
        />
      ),
      a: ({ node: _node, ...props }) => (
        <a
          {...props}
          className="text-content-link-action-default underline hover:text-content-link-action-hover"
        />
      ),
    }),
    [resolveImage]
  );

  return (
    <div className={clsx('flex flex-col gap-md', className)}>
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </Markdown>
    </div>
  );
};
