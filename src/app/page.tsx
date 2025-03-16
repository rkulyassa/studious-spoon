import Image from "next/image";
import Link from "next/link";
import abstractPic from "@/../public/abstract.jpg";

export default function Page() {
  return (
    <>
      <h1 className="text-3xl font-bold underline italic">Root page</h1>
      <Image src={abstractPic} alt="Abstract image" width="200" />
      <Link href="/login">Login</Link>
    </>
  );
}
