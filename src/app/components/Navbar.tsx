'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import Modal from '@/app/components/Modal';
import MyAccountPopup from '@/app/components/MyAccountPopup';

const Navbar: React.FC = () => {
  const [name, setName] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [showAccount, setShowAccount] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setName(localStorage.getItem('name'));
    setImage(localStorage.getItem('image'));

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = JSON.parse(atob(token.split('.')[1]));
        setUserId(decoded.userId);
      } catch (err) {
        console.log('Invalid token');
      }
    }

    const syncUser = () => {
      setName(localStorage.getItem('name'));
      setImage(localStorage.getItem('image'));
    };

    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
    toast('User logout');
  };

  return (
    <nav className="bg-[#FA9609] py-2 text-white">
      <div className="container max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Assignment-2</Link>

        <ul className="flex space-x-12">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/">About</Link></li>
          <li><Link href="/">Contact</Link></li>
        </ul>

        {name ? (
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center">
              {image && image.startsWith('/') ? (
                <img src={image} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-white text-[#FA9609] flex items-center justify-center text-2xl font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white text-black rounded shadow">
                <button onClick={() => { setShowAccount(true); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100"> My Account</button>
                <button onClick={() => router.push('/admin/Userlist')} className="w-full text-left px-4 py-2 hover:bg-gray-100"> UserList</button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => router.push('/LoginForm')} className="bg-white text-black px-5 py-2 rounded">Login</button>
        )}
      </div>
      <ToastContainer />
      {showAccount && userId && (
        <Modal onClose={() => setShowAccount(false)}>
          <MyAccountPopup userId={userId} />
        </Modal>
      )}
    </nav>
  );
};

export default Navbar;
