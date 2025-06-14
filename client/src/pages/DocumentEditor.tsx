import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiSave } from "react-icons/fi";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  //   View,
  StyleSheet,
} from "@react-pdf/renderer";
import { getDocument, createDocument, updateDocument } from "../api/api";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
    marginBottom: 20,
  },
  content: {
    fontSize: 12,
    lineHeight: 1.5,
  },
});

const MarkDownPDF = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>{title || "Untitled Document"}</Text>
      <Text style={styles.content}>{content}</Text>
    </Page>
  </Document>;
};

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
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
        setError("Failed to fetch document.");
        console.error(err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [id, navigate]);

  const handleSave = async () => {
    try {
      setLoading(true);
      if (isNew) {
        const response = await createDocument(title, content);
        navigate(`/documents/${response.data._id}`);
      } else {
        await updateDocument(id!, title, content);
      }
    } catch (err) {
      setError("Failed to save document.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading document...</div>;
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
            // document={<MarkDownPDF title={title} content={content} />}
            fileName={`${title || "document"}.pdf`}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export PDF
          </PDFDownloadLink>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 h-full pr-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your markdown here..."
            className="w-full h-full p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-1/2 h-full pl-4 overflow-y-auto">
          <div className="markdown-body p-4 border rounded-lg h-full">
            <ReactMarkdown
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
