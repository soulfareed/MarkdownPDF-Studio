import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";
import { getDocuments, deleteDocument } from "../api/api";
// import { useAuth } from "../context/AuthContext";

interface Document {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const { user } = useAuth();

  const fetchDocuments = async () => {
    try {
      const response = await getDocuments();
      setDocuments(response.data);
    } catch (err) {
      setError("Failed to fetch documents");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      setDocuments(documents.filter((doc) => doc._id !== id));
    } catch (err) {
      setError("Failed to delete document.");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 size-5">Loading document...</div>;
  }
  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Documents</h1>
        <Link
          to="/documents/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          <FiPlus className="mr-2" />
          New Document
        </Link>
      </div>
      {documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          You don't have any documents yet. Create one to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((document) => (
            <div
              key={document._id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <Link
                  to={`/documents/${document._id}`}
                  className="font-medium text-lg hover:text-blue-600"
                >
                  {document.title || "Untitled Document"}
                </Link>
                <div className="flex space-x-2">
                  <Link
                    to={`/documents/${document._id}`}
                    className="text-gray-500 hover:text-blue-600"
                    title="Edit"
                  >
                    <FiEdit2 />
                  </Link>
                  <button
                    onClick={() => handleDelete(document._id)}
                    className="text-gray-500 hover:text-red-600"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="text-sm text-grey-500 mb-2">
                Created: {new Date(document.createdAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500">
                Updated: {new Date(document.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Dashboard;
