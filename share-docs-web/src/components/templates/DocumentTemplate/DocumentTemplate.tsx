import { useNavigate } from 'react-router-dom';
import DocumentShare from '../../organisms/DocumentShare/DocumentShare';
import { useAppStore } from '../../../store/useAppStore';
import { useDocumentStore } from '../../../store/useDocumentStore';
import { DocumentPageType } from '../../../shared/types/components';
import DocumentAdd from '../../organisms/DocumentAdd/DocumentAdd';
import { createDocument } from '../../../services/createDocumentService';
import { useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { UserDocument } from '../../../models/api/document';
import DialogModal from '../../organisms/DialogModal/DialogModal';
import DocumentView from '../../organisms/DocumentView/DocumentView';
import { getDecryptedPayload } from '../../../services/web3Services';
import {
  ShareDocumentRequest,
  shareDocument
} from '../../../services/shareDocumentService';
import dayjs from 'dayjs';

const DocumentTemplate = () => {
  const { user } = useAppStore();
  const authContext = useContext(AuthContext);
  const { selectedDocument, documentPageType, selectedSharedDocument } =
    useDocumentStore();
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
  };

  const showDialog = (title: string, message: string) => {
    setDialogTitle(title);
    setDialogText(message);
    setIsOpen(true);
  };

  const onShare = async (email: string, expires: dayjs.Dayjs | null) => {
    const token = authContext?.authState?.token ?? '';
    if (
      token.length === 0 ||
      !user.skey ||
      !selectedDocument ||
      expires === null
    ) {
      authContext?.logout();
      // navigate('/');
      return;
    }
    const request: ShareDocumentRequest = {
      token,
      documentId: selectedDocument._id?.toString() ?? '',
      priKey: user.skey,
      email,
      expiresIn: expires.unix()
    }
    const result = await shareDocument(request);
    if (result) {
      setHasErrors(false);
      showDialog('Document Shared', 'Document shared successfully.');
    } else {
      setHasErrors(true);
      showDialog(
        'Share Document Error',
        'Could not share document. Please try again.'
      );
    }
  };

  const doDecrypt = (): string | undefined => {
    if (!user.skey) {
      navigate('/user');
      return;
    }
    const documentToDecrypt = selectedDocument
      ? selectedDocument
      : selectedSharedDocument
        ? selectedSharedDocument
        : undefined;
    if (!documentToDecrypt) {
      return undefined;
    }
    if (hasErrors) {
      navigate('/user');
      return;
    }
    if (documentPageType === DocumentPageType.View) {
      try {
        const userDocument = getDecryptedPayload(user.skey, documentToDecrypt.payload);
        return JSON.stringify(userDocument);
      } catch (error) {
        console.log('Decrypt Error = ', error);
        setHasErrors(true);
        showDialog(
          'View Document',
          'Could not view the document. The document may be corrupted.'
        );
      }
    }
    return undefined;
  };

  const decryptedDocument = doDecrypt();

  const onAdd = async (payload: string) => {
    const token = authContext?.authState?.token ?? '';
    if (token.length === 0 || !user.pkey) {
      authContext?.logout();
      // navigate('/');
      return;
    }
    try {
      const payloadAsDocument: UserDocument = JSON.parse(payload);
      const result = await createDocument(token, user.pkey, payloadAsDocument);
      if (!result) {
        setHasErrors(true);
        showDialog(
          'Adding Document',
          'Could not add document. Please try again.'
        );
      } else {
        setHasErrors(false);
        showDialog('Document Added', 'Document added successfully.');
      }
    } catch (error) {
      console.log('Error = ', error);
      setHasErrors(true);
      showDialog(
        'Adding Document',
        'Could not add document. Please try again.'
      );
    }
  };

  const onCancel = () => {
    navigate('/user');
  };

  return (
    <>
      {documentPageType === DocumentPageType.Share && selectedDocument && (
        <DocumentShare
          document={selectedDocument}
          user={user}
          onShare={onShare}
          onCancel={onCancel}
        />
      )}
      {documentPageType === DocumentPageType.Add && (
        <DocumentAdd onAdd={onAdd} onCancel={onCancel} />
      )}
      {documentPageType === DocumentPageType.View && (
        <DocumentView document={decryptedDocument} onCancel={onCancel} />
      )}
      <DialogModal
        text={dialogText}
        title={dialogTitle}
        isOpen={isOpen}
        onClose={onDialogClosed}
      />
    </>
  );
};

export default DocumentTemplate;
