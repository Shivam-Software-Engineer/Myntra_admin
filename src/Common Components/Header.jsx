import { Menu, Bell, User, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../Redux Toolkit/Slice/loginSlice";

export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef(null);
  let dispatch = useDispatch();
    let navigate = useNavigate();
    let user = useSelector((store) => store.login.user);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  let logoutUser = () => {
    dispatch(logout());
    navigate("/");
  }

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user]);
  return (
   <section>
     <header className="flex h-16 items-center justify-end border-b border-neutral-800 bg-neutral-900 px-6">
      
      
      {/* Right: notifications + profile */}
      <div className="flex items-end ">
        

        <div className="relative ml-1" ref={menuRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="block h-9 w-9 overflow-hidden rounded-full ring-teal-500/50 ring-2  "
          >
            <img
              src="./assets/images/user.png"
              alt="Profile"
              className="h-full w-full "
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-52 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-lg">
              <button
                type="button"
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
              >
                <User size={16} />
                Your account
              </button>
              <button onClick={logoutUser}
                type="button"
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
   </section>
  );
}