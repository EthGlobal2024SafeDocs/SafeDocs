import { create } from 'zustand';
import Document from '../models/api/document';
import { DocumentPageType } from '../shared/types/components';

type DocumentsState = {
  myDocuments: Document[];
  selectedDocument: Document;
  sharedDocuments: Document[];
  selectedSharedDocument: Document;
  documentPageType: DocumentPageType;
  setMyDocuments: (documents: Document[]) => void;
  setSelectedDocument: (document: Document) => void;
  setSharedDocuments: (documents: Document[]) => void;
  setSelectedSharedDocument: (document: Document) => void;
  setDocumentPageType: (documentPageType: DocumentPageType) => void;
  resetState: () => void;
};

const getInitialState = () => {
  return { } as DocumentsState;
};

export const useDocumentStore = create<DocumentsState>((set) => ({
  ...getInitialState(),
  resetState: () =>
    set((state) => ({
      ...state,
      ...getInitialState()
    })),
  setMyDocuments: (documents: Document[]) => {
    set((state) => ({...state, myDocuments: documents}));
  },
  setSelectedDocument: (document: Document) => {
    set((state) => ({...state, selectedDocument: document}));
  },
  setSharedDocuments: (documents: Document[]) => {
    set((state) => ({...state, sharedDocuments: documents}));
  },
  setSelectedSharedDocument: (document: Document) => {
    set((state) => ({...state, selectedSharedDocument: document}));
  },
  setDocumentPageType: (documentPageType: DocumentPageType) => {
      set((state) => ({...state, documentPageType}));
  },
}));


window['appStore'] = window['appStore'] || {};
window['appStore'].useDocumentStore = useDocumentStore;