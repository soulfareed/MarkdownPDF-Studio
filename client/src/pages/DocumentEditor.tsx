import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "github-markdown-css";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiSave } from "react-icons/fi";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import { getDocument, createDocument, updateDocument } from "../api/api";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  content: {
    fontSize: 12,
    lineHeight: 1.5,
  },
});

const MarkdownPDF = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>{title || "Untitled Document"}</Text>
      <Text style={styles.content}>{content}</Text>
    </Page>
  </Document>
);

const DocumentEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocument = async () => {
      if (id === "new") {
        setIsNew(true);
        setLoading(false);
        return;
      }

      try {
        const response = await getDocument(id!);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (err) {
        setError("Failed to fetch document");
        console.error(err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, navigate]);

  const handleSave = async () => {
    try {
      setLoading(true);
      let response;

      if (isNew) {
        response = await createDocument(title, content);
        console.log("Create response:", response);
        navigate(`/documents/${response._id}`);
      } else {
        response = await updateDocument(id, title, content);
        console.log("Update response:", response);
      }

      return response;
    } catch (error: any) {
      console.error("Full error details:", {
        error,
        request: error.config,
        response: error.response,
      });
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save document"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading document...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document Title"
          className="text-2xl font-bold border-b-2 border-gray-200 focus:border-blue-500 outline-none py-2 w-full"
        />
        <div className="flex space-x-2 ml-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            <FiSave className="mr-2" /> {loading ? "Saving..." : "Save"}
          </button>
          <PDFDownloadLink
            document={<MarkdownPDF title={title} content={content} />}
            fileName={`${title || "document"}.pdf`}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export PDF
          </PDFDownloadLink>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 pr-10">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your markdown here..."
            className="w-full h-full p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none "
          />
        </div>
        <div className="w-1/2 h-full pl-4 overflow-y-auto">
          <div className="markdown-body p-4 border rounded-lg h-full">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
