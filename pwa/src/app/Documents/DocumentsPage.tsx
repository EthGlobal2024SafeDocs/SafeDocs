import { useRouteContext } from "@tanstack/react-router";
import { GetDocuments } from "@/services/api";

import { useQuery } from "@tanstack/react-query";
import { Button } from "flowbite-react";

export function DocumentsPage() {
  const { token } = useRouteContext({ from: "/_auth" });

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["documents", token],
    queryFn: async () => {
      const docs = await GetDocuments(token!);
      return docs;
    }
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
    <div className="max-w-lg">
      <Button color="blue">Create new document</Button>
      {/* {data?.map((d) => (
          <DocumentIcon key={d._id} document={d}></DocumentIcon>
        ))} */}
    </div>
  );
}
