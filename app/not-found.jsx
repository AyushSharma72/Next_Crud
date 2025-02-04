import Link from "next/link"
function NotFound() {
  return (
    <div className="flex justify-center flex-col items-center ">
      <h1 className="text-red-600 text-3xl mt-10 font-bold">Page not found</h1>
      <Link href="/" className="mt-10 bg-blue-600 text-black rounded-md p-2 font-bold"><button>home</button></Link>
    </div>
  );
}

export default NotFound;
