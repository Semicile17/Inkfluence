import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { slugifyHeading } from '../../lib/markdown.js';

export default function ArticleBody({ content = '' }) {
  return (
    <div className="prose-ink">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 id={slugifyHeading(String(children))} className="scroll-mt-28">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 id={slugifyHeading(String(children))} className="scroll-mt-28">
              {children}
            </h3>
          ),
          a: ({ href, children, ...props }) => {
            const external = href?.startsWith('http');
            return (
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer noopener' : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt, ...props }) => (
            <img src={src} alt={alt || ''} loading="lazy" {...props} />
          ),
          input: ({ ...props }) => <input {...props} disabled />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
