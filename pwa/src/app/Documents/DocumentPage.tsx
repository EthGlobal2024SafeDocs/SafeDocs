import { useRouteContext, redirect } from "@tanstack/react-router";
import { GetDocument } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Route } from "@/routes/_auth/documents/$documentId";
import { Card, Button, Modal } from "flowbite-react";
import { DecryptPayload } from "@/services/user";
import { getKeyByUsername } from "@/services/db";
import { useState } from "react";

type EncryptedPayload = {
  key: string;
  cipher: string;
};

type Data = {
  documentType: string;
  decryptedPayload: string;
};

const getData = async (token:string, documentId:string) => {
  const document = await GetDocument(token!, documentId);

  // Process the data
  const documentType:string = document.document_type;
  const payload:EncryptedPayload = document.payload;

  // Decrypt the data using local storage
  const key = await getKeyByUsername("test1");
  /*
  const p = {
    number: '12345678',
    firstName: 'Alice',
    lastName: 'Brooks',
    cardNumber: '9999999999',
  }

  console.log(encryptData(Proxy.to_hex(Proxy.private_key_from_bytes(Proxy.from_hex(key)).get_public_key().to_bytes()), JSON.stringify(p)));
  */
  const decryptedPayload = await DecryptPayload(payload, key!);

  return({
    documentType: documentType,
    decryptedPayload: decryptedPayload!
  } as Data);
}

export function DocumentPage() {
  const { token } = useRouteContext({ from: "/_auth"})
  const { documentId } = Route.useParams();
  const [shareOpen, setShareOpen] = useState(false);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['document', documentId],
    queryFn: () => getData("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmQ4YmNhYTI0NjE2Y2IzMGUyMjAyNjQiLCJlbWFpbCI6InRlc3QxQGVtYWlsLmNvbSIsImlhdCI6MTcyNTYxNzI2NSwiZXhwIjoxNzI1NjIwODY1fQ.be9cDwSG80O0f4urGGgtyxsrQUAdwUaSnSgebuA9KUs", documentId),
    //queryFn: () => getData(token!, documentId),
  });

  if(isPending) {
    return(
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  if(isError) {
    console.log(error)
    throw redirect({ to: "/documents" });
  }

  // Assume data is good
  return(
    <div>
      <Card className="max-w-lg">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {data.documentType}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {data.decryptedPayload}
        </p>
        <Button color="blue" onClick={() => setShareOpen(true)}>Share</Button>
      </Card>
      
      <Modal show={shareOpen} onClose={() => setShareOpen(false)}>
        <Modal.Header>Terms of Service</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
              companies around the world are updating their terms of service agreements to comply.
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant
              to ensure a common set of data rights in the European Union. It requires organizations to notify users as
              soon as possible of high-risk data breaches that could personally affect them.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShareOpen(false)}>I accept</Button>
          <Button color="gray" onClick={() => setShareOpen(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
      
    </div>
  );
}