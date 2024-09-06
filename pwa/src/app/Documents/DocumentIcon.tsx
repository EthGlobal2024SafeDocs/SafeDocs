import { Document } from "@/services/api"
import { Card } from "flowbite-react";
import { Link } from "@tanstack/react-router";

export const DocumentIcon = ({ document }: { document: Document }) => {
    return(
        <Link to="/documents/$documentId" params={{ documentId: document._id}}>
            <Card href="#" className="max-w-sm">
                <p className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                    {document._id}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    {document.document_type}
                </p>
            </Card>
        </Link>
    );
}