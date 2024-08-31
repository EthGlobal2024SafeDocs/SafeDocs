import { useContext, useEffect, useState } from "react";
import UserContent from "../../organisms/UserContent/UserContent"
import { AuthContext } from "../../../context/AuthContext";
import { getDocuments, getSharedDocuments } from "../../../services/getDocumentsApiServices";
import Document from '../../../models/api/document';
import { useNavigate } from "react-router-dom";

const UserTemplate = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
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

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContent myDocuments={myDocuments} sharedDocuments={sharedDocuments} />
  );
};

export default UserTemplate;
