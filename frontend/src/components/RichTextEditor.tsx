import React, { useEffect, useRef } from "react";
import { Bold, Highlighter, Italic, Palette, Underline } from "lucide-react";

const ALLOWED_TAGS = new Set([
  "P", "DIV", "BR", "STRONG", "B", "EM", "I", "U", "MARK", "SPAN",
  "UL", "OL", "LI", "H1", "H2", "H3", "FONT",
]);

const cleanStyle = (style: string) => style
  .split(";")
  .map(rule => rule.trim())
  .filter(rule => /^(font-size|color|background-color|text-align)\s*:/i.test(rule))
  .filter(rule => !/url\s*\(|expression\s*\(|javascript\s*:/i.test(rule))
  .join("; ");

export const sanitizeRichText = (value: string) => {
  if (!value) return "";
  const parser = new DOMParser();
  const documentFragment = parser.parseFromString(value, "text/html");

  const cleanNode = (node: Node): Node | null => {
    if (node.nodeType === Node.TEXT_NODE) return node.cloneNode();
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const element = node as HTMLElement;
    if (!ALLOWED_TAGS.has(element.tagName)) {
      const fragment = documentFragment.createDocumentFragment();
      element.childNodes.forEach(child => {
        const cleanChild = cleanNode(child);
        if (cleanChild) fragment.appendChild(cleanChild);
      });
      return fragment;
    }

    const cleanElement = documentFragment.createElement(element.tagName.toLowerCase());
    Array.from(element.attributes).forEach(attribute => {
      if (attribute.name === "style") {
        const style = cleanStyle(attribute.value);
        if (style) cleanElement.setAttribute("style", style);
      }
      if (element.tagName === "FONT" && (attribute.name === "color" || attribute.name === "size")) {
        if (/^(#[0-9a-f]{3,8}|rgb|hsl|[a-z]+|\d+)$/i.test(attribute.value.trim())) {
          cleanElement.setAttribute(attribute.name, attribute.value);
        }
      }
    });
    element.childNodes.forEach(child => {
      const cleanChild = cleanNode(child);
      if (cleanChild) cleanElement.appendChild(cleanChild);
    });
    return cleanElement;
  };

  const wrapper = documentFragment.createElement("div");
  documentFragment.body.childNodes.forEach(child => {
    const cleanChild = cleanNode(child);
    if (cleanChild) wrapper.appendChild(cleanChild);
  });
  return wrapper.innerHTML;
};

const runCommand = (command: string, value?: string) => {
  document.execCommand(command, false, value);
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write a description...",
  minHeight = "150px",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const format = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    runCommand(command, commandValue);
    onChange(editorRef.current?.innerHTML ?? "");
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2" role="toolbar" aria-label="Text formatting">
        <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => format("bold")} className="rounded-lg p-2 text-slate-600 hover:bg-white hover:text-red-700" title="Bold" aria-label="Bold"><Bold className="h-4 w-4" /></button>
        <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => format("italic")} className="rounded-lg p-2 text-slate-600 hover:bg-white hover:text-red-700" title="Italic" aria-label="Italic"><Italic className="h-4 w-4" /></button>
        <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => format("underline")} className="rounded-lg p-2 text-slate-600 hover:bg-white hover:text-red-700" title="Underline" aria-label="Underline"><Underline className="h-4 w-4" /></button>
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => format("hiliteColor", "#fff2a8")} className="rounded-lg p-2 text-amber-600 hover:bg-white" title="Highlight" aria-label="Highlight"><Highlighter className="h-4 w-4" /></button>
        <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => format("foreColor", "#b91c1c")} className="rounded-lg p-2 text-red-700 hover:bg-white" title="Red text" aria-label="Red text"><Palette className="h-4 w-4" /></button>
        <select defaultValue="" onChange={event => { format("fontSize", event.target.value); event.target.value = ""; }} className="ml-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600" aria-label="Font size">
          <option value="" disabled>Font size</option>
          <option value="2">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="6">Very large</option>
        </select>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={event => onChange(event.currentTarget.innerHTML)}
        data-placeholder={placeholder}
        className="rich-text-editor px-4 py-3 text-sm leading-7 text-slate-700 outline-none"
        style={{ minHeight }}
      />
    </div>
  );
};

export const RichTextContent: React.FC<{ value?: string; className?: string }> = ({ value, className = "" }) => (
  <div
    className={`rich-text-content ${className}`}
    dangerouslySetInnerHTML={{ __html: sanitizeRichText(value ?? "") }}
  />
);

export default RichTextEditor;
