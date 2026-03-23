'use client';

import { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function RichTextEditor({ value, onChange, placeholder = '请输入内容...', minHeight = 120 }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCmd = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
  };

  const handleLink = () => {
    const url = prompt('请输入链接网址：');
    if (url) execCmd('createLink', url);
  };

  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="flex flex-wrap gap-0.5 px-2 py-1.5 bg-gray-50 border-b">
        {[
          { cmd: 'bold', icon: 'B', title: '粗体' },
          { cmd: 'italic', icon: 'I', title: '斜体' },
          { cmd: 'underline', icon: 'U', title: '底线' },
          { cmd: 'strikeThrough', icon: 'S̶', title: '删除线' },
        ].map(btn => (
          <button
            key={btn.cmd}
            type="button"
            title={btn.title}
            onMouseDown={(e) => { e.preventDefault(); execCmd(btn.cmd); }}
            className="w-8 h-8 text-sm text-gray-600 hover:bg-blue hover:text-white rounded transition-colors"
          >
            {btn.icon}
          </button>
        ))}
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <button type="button" title="项目符号" onMouseDown={(e) => { e.preventDefault(); execCmd('insertUnorderedList'); }} className="w-8 h-8 text-sm text-gray-600 hover:bg-blue hover:text-white rounded transition-colors">
          <span className="text-base leading-none">•</span>
        </button>
        <button type="button" title="编号" onMouseDown={(e) => { e.preventDefault(); execCmd('insertOrderedList'); }} className="w-8 h-8 text-sm text-gray-600 hover:bg-blue hover:text-white rounded transition-colors">
          <span className="text-base leading-none">1.</span>
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <button type="button" title="插入链接" onMouseDown={(e) => { e.preventDefault(); handleLink(); }} className="w-8 h-8 text-gray-600 hover:bg-blue hover:text-white rounded transition-colors flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
        </button>
        <button type="button" title="清除格式" onMouseDown={(e) => { e.preventDefault(); execCmd('removeFormat'); }} className="w-8 h-8 text-sm text-gray-600 hover:bg-blue hover:text-white rounded transition-colors">
          <span className="text-base leading-none">∅</span>
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={handleInput}
        style={{ minHeight }}
        data-placeholder={placeholder}
        className="px-4 py-3 text-sm outline-none"
      />
      <style>{`
        [contenteditable="true"]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
