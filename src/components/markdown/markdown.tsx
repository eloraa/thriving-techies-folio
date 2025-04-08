'use client';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { defaultSchema } from 'hast-util-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useTheme } from '@/store/theme';
import { Button } from '../ui/button';
import { Check, Copy } from 'lucide-react';

interface CopyTextProps {
  text: string;
  className?: string;
}

const CopyText: React.FC<CopyTextProps> = ({ text }) => {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const copy = async () => {
    await navigator.clipboard.writeText(text || window.location.href);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setCopied(true);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="icon" onClick={copy} title={copied ? 'Copied!' : 'Copy to clipboard'} className="bg-accent/5 border-0">
      <span className="sr-only">{copied ? 'Copied!' : 'Copy'}</span>
      {copied ? <Check /> : <Copy />}
    </Button>
  );
};

interface MarkdownPreviewProps {
  content: string;
}

const lightStyle: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: '#000000',
    fontFamily: "'Fira Code Variable', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontSize: '1em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#000000',
    fontFamily: "'Fira Code Variable', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontSize: '1em',
    fontWeight: '400',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
    overflow: 'auto',
    borderRadius: '.5em',
    backgroundColor: '#f6f8fa',
  },
  comment: { color: '#6a737d' },
  prolog: { color: '#6a737d' },
  doctype: { color: '#6a737d' },
  cdata: { color: '#6a737d' },
  punctuation: { color: '#24292e' },
  namespace: { color: '#005cc5' },
  tag: { color: '#22863a' },
  boolean: { color: '#005cc5' },
  number: { color: '#005cc5' },
  deleted: { color: '#d73a49' },
  keyword: { color: '#d73a49' },
  property: { color: '#005cc5' },
  selector: { color: '#d73a49' },
  constant: { color: '#005cc5' },
  symbol: { color: '#005cc5' },
  builtin: { color: '#005cc5' },
  'attr-name': { color: '#005cc5' },
  'attr-value': { color: '#032f62' },
  string: { color: '#032f62' },
  char: { color: '#032f62' },
  operator: { color: '#d73a49' },
  entity: { color: '#005cc5', cursor: 'help' },
  url: { color: '#005cc5' },
  '.language-css .token.string': { color: '#005cc5' },
  '.style .token.string': { color: '#005cc5' },
  variable: { color: '#005cc5' },
  inserted: { color: '#22863a' },
  atrule: { color: '#d73a49' },
  regex: { color: '#032f62' },
  important: { color: '#d73a49', fontWeight: 'medium' },
  medium: { fontWeight: 'medium' },
  italic: { fontStyle: 'italic' },
  '.language-markup .token.tag': { color: '#22863a' },
  '.language-markup .token.attr-name': { color: '#005cc5' },
  '.language-markup .token.punctuation': { color: '#24292e' },
};

const darkStyle: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: '#ffffff',
    fontFamily: "'Fira Code Variable', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontSize: '1em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#ffffff',
    fontFamily: "'Fira Code Variable', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontSize: '1em',
    fontWeight: '400',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
    overflow: 'auto',
    borderRadius: '.5em',
    backgroundColor: '#1a1a1a',
  },
  comment: { color: '#6f6f6f' },
  prolog: { color: '#6f6f6f' },
  doctype: { color: '#6f6f6f' },
  cdata: { color: '#6f6f6f' },
  punctuation: { color: '#86897a' },
  namespace: { color: '#93beff' },
  tag: { color: '#dbfffa' },
  boolean: { color: '#7ad9fb' },
  number: { color: '#7ad9fb' },
  deleted: { color: '#ff6b6b' },
  keyword: { color: '#dbfffa' },
  property: { color: '#93beff' },
  selector: { color: '#ff6b6b' },
  constant: { color: '#dbfffa' },
  symbol: { color: 'hsl(53, 89%, 79%)' },
  builtin: { color: 'hsl(53, 89%, 79%)' },
  'attr-name': { color: '#dbfffa' },
  'attr-value': { color: '#cabeff' },
  string: { color: '#4be4f7' },
  char: { color: '#4be4f7' },
  operator: { color: '#7ad9fb' },
  entity: { color: '#00d4af', cursor: 'help' },
  url: { color: '#00d4af' },
  '.language-css .token.string': { color: '#00d4af' },
  '.style .token.string': { color: '#00d4af' },
  variable: { color: '#00d4af' },
  inserted: { color: '#00d4af' },
  atrule: { color: 'hsl(218, 22%, 55%)' },
  regex: { color: '#bbfe81' },
  important: { color: '#bbfe81', fontWeight: 'medium' },
  medium: { fontWeight: 'medium' },
  italic: { fontStyle: 'italic' },
  '.language-markup .token.tag': { color: 'hsl(33, 33%, 52%)' },
  '.language-markup .token.attr-name': { color: 'hsl(33, 33%, 52%)' },
  '.language-markup .token.punctuation': { color: 'hsl(33, 33%, 52%)' },
};

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = React.memo(({ content }) => {
  const { theme } = useTheme();
  const style = theme === 'dark' ? darkStyle : lightStyle;

  return (
    <div className="markdown-body">
      <ReactMarkdown
        components={{
          a({ children, ...otherProps }) {
            return (
              <a rel="noopener noreferrer" target="_blank" {...otherProps}>
                {children}
              </a>
            );
          },
          pre({ children }) {
            return <pre style={{ position: 'relative' }}>{children}</pre>;
          },
          code({ children, className = '' }: React.ComponentPropsWithoutRef<'code'>) {
            const code = Array.isArray(children) ? String(children[0] || '').replace(/\n$/, '') : String(children || '').replace(/\n$/, '');
            const match = /language-(\w+)/.exec(className || '');

            if (match) {
              return (
                <>
                  <div className="absolute top-3 right-3">
                    <div className="sticky top-0 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-mono">{match[1]}</span>
                      <CopyText text={code} className="bg-background/60 hover:bg-background/80 transition-colors" />
                    </div>
                  </div>
                  <div className="w-full overflow-auto pr-10">
                    <SyntaxHighlighter style={style} language={match[1]} PreTag="span">
                      {code}
                    </SyntaxHighlighter>
                  </div>
                </>
              );
            }

            return <code>{code}</code>;
          },
        }}
        rehypePlugins={[
          rehypeRaw,
          [
            rehypeSanitize,
            {
              ...defaultSchema,
              attributes: {
                ...defaultSchema.attributes,
                code: [['className', 'language-norun', 'language-js', 'language-jsx', 'language-ts', 'language-tsx', 'language-bash', 'language-css', 'language-md', 'language-glsl']],
              },
            },
          ],
        ]}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownPreview.displayName = 'MarkdownPreview';
