import { Suspense } from "react";

import DocumentInvoice from "./DocumentInvoice";

export default function Page() {
  return (
    <Suspense>
      <DocumentInvoice />
    </Suspense>
  );
}
