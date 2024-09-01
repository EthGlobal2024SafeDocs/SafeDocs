import { useNavigate } from "react-router-dom";
import DocumentShare from "../../organisms/DocumentShare/DocumentShare";
import { useAppStore } from "../../../store/useAppStore";
import { useDocumentStore } from "../../../store/useDocumentStore";
import { DocumentPageType } from "../../../shared/types/components";
import DocumentAdd from "../../organisms/DocumentAdd/DocumentAdd";
import { createDocument } from "../../../services/createDocumentService";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { UserDocument } from "../../../models/api/document";
import DialogModal from "../../organisms/DialogModal/DialogModal";

const DocumentTemplate = () => {
  const { user } = useAppStore();
  const authContext = useContext(AuthContext);
  const { selectedDocument, documentPageType, selectedSharedDocument } = useDocumentStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState<string | undefined>();
  const [dialogText, setDialogText] = useState<string>('');
  const [hasErrors, setHasErrors] = useState<boolean>(false);

  const onDialogClosed = () => {
    setIsOpen(false);
    if (!hasErrors) {
      navigate('/user');
    }
  }

  const showDialog = (title: string, message: string) => {
    setDialogTitle(title);
    setDialogText(message);
    setIsOpen(true);
  }

  const onShare = (email: string) => {
    console.log('share doc. email = ', email);
    console.log('share document = ', selectedDocument);
    navigate('/user');
  }

  const onAdd = async (payload: string) => {
    console.log('Adding document with payload: ', payload);
    const token = authContext?.authState?.token ?? '';
    if (token.length === 0 || !user.pkey) {
      navigate('/');
      return;
    }
    try {
      const payloadAsDocument: UserDocument = JSON.parse(payload);
      const result = await createDocument(token, user.pkey, payloadAsDocument);
      console.log('Document created = ', result);
      if (!result) {
        setHasErrors(true);
        showDialog('Adding Document', 'Could not add document. Please try again.');
      } else {
        setHasErrors(false);
        showDialog('Document Added', 'Document added successfully.');
      }
    } catch (error) {
      console.log('Error = ', error);
      setHasErrors(true);
      showDialog('Adding Document', 'Could not add document. Please try again.');
    }
  }

  const onCancel = () => {
    navigate('/user');
  }

  return (
    <>
      {documentPageType === DocumentPageType.Share &&
        <DocumentShare document={selectedDocument} user={user} onShare={onShare} onCancel={onCancel} />}
      {documentPageType === DocumentPageType.Add &&
        <DocumentAdd onAdd={onAdd} onCancel={onCancel} />}
      <DialogModal text={dialogText} title={dialogTitle} isOpen={isOpen} onClose={onDialogClosed} />
    </>
  );
};

export default DocumentTemplate;
