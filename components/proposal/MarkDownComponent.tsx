import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkDownComponent = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
}
export default MarkDownComponent;
