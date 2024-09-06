import { useRouteContext } from "@tanstack/react-router";
import { GetDocuments } from "@/services/api";
import { DocumentIcon } from "./DocumentIcon";
import { Document } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "flowbite-react";

async function getData(token:string) {
  console.log(token);
  const docs = await GetDocuments(token!);
  console.log(docs);
  return docs;
}

export function DocumentsPage() {
  const { token } = useRouteContext({ from: "/_auth"});

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['documents'],
    //queryFn: () => getData(token!),
    queryFn: () => getData("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmQ4YmNhYTI0NjE2Y2IzMGUyMjAyNjQiLCJlbWFpbCI6InRlc3QxQGVtYWlsLmNvbSIsImlhdCI6MTcyNTYxNzI2NSwiZXhwIjoxNzI1NjIwODY1fQ.be9cDwSG80O0f4urGGgtyxsrQUAdwUaSnSgebuA9KUs"),
  });
  
  if (isPending) {
    return(
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (isError) {
    return(
      <div>
        <h1>Error: {error.message}</h1>
      </div>
    );
  }

  return(
    <div className="max-w-lg">
      <Button color="blue">Create new document</Button>
      {data?.map(d => (
        <DocumentIcon key={d._id} document={d}></DocumentIcon>
      ))}
    </div>
  );
}
