import { create } from 'zustand';
import Document from '../models/api/document';
import { DocumentPageType } from '../shared/types/components';

type DocumentsState = {
  myDocuments: Document[];
  selectedDocument: Document | undefined;
  sharedDocuments: Document[];
  selectedSharedDocument: Document | undefined;
  documentPageType: DocumentPageType;
  setMyDocuments: (documents: Document[]) => void;
  setSelectedDocument: (document: Document | undefined) => void;
  setSharedDocuments: (documents: Document[]) => void;
  setSelectedSharedDocument: (document: Document | undefined) => void;
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
  setSelectedDocument: (document: Document | undefined) => {
    set((state) => ({...state, selectedDocument: document}));
  },
  setSharedDocuments: (documents: Document[]) => {
    set((state) => ({...state, sharedDocuments: documents}));
  },
  setSelectedSharedDocument: (document: Document | undefined) => {
    set((state) => ({...state, selectedSharedDocument: document}));
  },
  setDocumentPageType: (documentPageType: DocumentPageType) => {
      set((state) => ({...state, documentPageType}));
  },
}));


window['appStore'] = window['appStore'] || {};
window['appStore'].useDocumentStore = useDocumentStore;