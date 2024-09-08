import { getSharedDocuments } from "@/services/document";
import { useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { Helmet } from "react-helmet";
import { DocumentItem } from "../Documents/Operations/DocumentItem";

export function ShareListPage() {
  const context = useRouteContext({ from: "__root__" });

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["shared-documents"],
    queryFn: async () => {
      return await getSharedDocuments(context);
    },
  });

  if (isPending) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h1>Error: {error?.message}</h1>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shared Documents</title>
      </Helmet>
      <div className="flex flex-col">
        <div className="mt-2">
          {data?.length <= 0 && <div className="w-full pt-10 text-center">You Have No Shared Documents!</div>}
          {data?.map(
            (d) =>
              d && (
                <DocumentItem
                  key={d.document_id}
                  id={d.document_id}
                  payload={d.payload}
                  type={d.document_type}
                ></DocumentItem>
              ),
          )}
        </div>
      </div>
    </>
  );
}
