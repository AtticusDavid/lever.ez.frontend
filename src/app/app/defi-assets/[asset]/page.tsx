"use client";
import { useParams, useRouter } from "next/navigation";
import { object, string } from "yup";
import assets from "../assets";

const paramsSchema = object({
  asset: string()
    .required()
    .oneOf(assets.map((x) => x.name.toLowerCase())),
}).required();

export default function DefiAssets() {
  const router = useRouter();
  const params = useParams();

  console.log({ router, params });

  const result = paramsSchema.validateSync(params);

  return (
    <main>
      <div className=" bg-red-400">this is defiassets for {result.asset}</div>
    </main>
  );
}
