import { create } from 'zustand';
import Document from '../models/api/document';

type DocumentsState = {
  myDocuments: Document[];
  selectedDocument: Document;
  sharedDocuments: Document[];
  selectedSharedDocument: Document;
  setMyDocuments: (documents: Document[]) => void;
  setSelectedDocument: (document: Document) => void;
  setSharedDocuments: (documents: Document[]) => void;
  setSelectedSharedDocument: (document: Document) => void;
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
    set((state) => ({ ...state, selectedDocument: document }));
  },
  setSharedDocuments: (documents: Document[]) => {
    set((state) => ({...state, sharedDocuments: documents}));
  },
  setSelectedSharedDocument: (document: Document) => {
    set((state) => ({ ...state, selectedSharedDocument: document }));
  },
}));


window['appStore'] = window['appStore'] || {};
window['appStore'].useDocumentStore = useDocumentStore;