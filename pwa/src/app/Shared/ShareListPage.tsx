import { getSharedDocuments } from "@/services/document";
import { useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { Helmet } from "react-helmet";
import { SharedItem } from "./Operations/SharedItem";

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
    console.log(data);
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
        <div className="mt-2  flex flex-col gap-y-4">
          {data?.length <= 0 && <div className="w-full pt-10 text-center">You Have No Shared Documents!</div>}
          {data?.map((d) => d && <SharedItem key={d.document_id} {...d} />)}
        </div>
      </div>
    </>
  );
}
