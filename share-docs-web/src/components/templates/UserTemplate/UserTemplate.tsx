import { useContext, useEffect, useState } from "react";
import UserContent from "../../organisms/UserContent/UserContent"
import { AuthContext } from "../../../context/AuthContext";
import { getDocuments, getSharedDocuments } from "../../../services/getDocumentsApiServices";
import Document from '../../../models/api/document';
import { useNavigate } from "react-router-dom";
import { useDocumentStore } from "../../../store/useDocumentStore";
import { DocumentPageType } from "../../../shared/types/components";

const UserTemplate = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { setSelectedDocument, setSelectedSharedDocument, setDocumentPageType } = useDocumentStore();
  const [myDocuments, setMyDocuments] = useState<Document[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<Document[]>([]);

  const fetchUserData = async (): Promise<void> => {
    const token = authContext?.authState?.token ?? '';
    if (token.length === 0) {
      navigate('/');
      return;
    }
    const data = await getDocuments(token);
    setMyDocuments(data);
    const sharedDocumentsResult = await getSharedDocuments(token);
    setSharedDocuments(sharedDocumentsResult);
  };

  const handleClick = (documentPageType: DocumentPageType, document?: Document) => {
    setDocumentPageType(documentPageType);
    if (document) {
      switch (documentPageType) {
        case DocumentPageType.Share:
          setSelectedDocument(document);
          setSelectedSharedDocument(undefined);
          break;
        case DocumentPageType.View:
          setSelectedSharedDocument(document);
          setSelectedDocument(undefined);
          break;
        default:
          // no document needed
      }
    }
    navigate('/document')
  }

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContent
      myDocuments={myDocuments}
      sharedDocuments={sharedDocuments}
      onClick={handleClick}
    />
  );
};

export default UserTemplate;
