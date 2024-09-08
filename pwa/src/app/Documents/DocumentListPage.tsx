import { Link, useRouteContext } from "@tanstack/react-router";
import { Helmet } from "react-helmet";

import { useQuery } from "@tanstack/react-query";
import { Dropdown } from "flowbite-react";
import { DocumentItem } from "./Operations/DocumentItem";
import { getDocuments } from "@/services/document";

export function DocumentsPage() {
  const context = useRouteContext({ from: "/_auth" });

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const docs = await getDocuments(context);
      console.log('docs', docs)
      return docs;
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
        <title>My Documents</title>
      </Helmet>
      <div className="flex flex-col">
        <div className="self-end">
          <Dropdown label="New" dismissOnClick={true} size="sm">
            <Dropdown.Item as={Link} to="/documents/new">
              Document
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/documents/newImage">Image</Dropdown.Item>
          </Dropdown>
        </div>

        <div className="mt-2 flex flex-col gap-y-4">
          {data?.length <= 0 && <div className="w-full pt-10 text-center">No Documents Exist!</div>}
          {data?.map((d) => d && <DocumentItem key={d._id} {...d} />)}
        </div>
      </div>
    </>
  );
}
