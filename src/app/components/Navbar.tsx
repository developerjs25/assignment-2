import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-[#FA9609] py-4 text-white">
      <div className="container max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Assignment-2</Link>
        <ul className="flex space-x-12">
          <li><Link href="/" className="hover:text-gray-200">Home</Link></li>
          <li><Link href="/" className="hover:text-gray-200">About</Link></li>
          <li><Link href="/" className="hover:text-gray-200">Contact</Link></li>
        </ul>
        <div className="">
        <Link href="/LoginForm" className="bg-white py-2 px-9 rounded-xl text-black text-xl">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;