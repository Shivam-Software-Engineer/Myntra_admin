import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  FolderTree,
  Layers3,
  CirclePlus,
  Eye,
  Users,
  Truck,
  Ticket,
  Briefcase,
  ChevronDown,
} from "lucide-react";
import { Link, useLocation } from "react-router";

export default function Sidebar() {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState("");

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  // Automatically open submenu based on current route
  useEffect(() => {
    if (
      location.pathname.startsWith("/add-category") ||
      location.pathname.startsWith("/view-category")
    ) {
      setOpenMenu("category");
    } else if (
      location.pathname.startsWith("/add-subcategory") ||
      location.pathname.startsWith("/view-subcategory")
    ) {
      setOpenMenu("subcategory");
    } else if (
      location.pathname.startsWith("/add-productcategory") ||
      location.pathname.startsWith("/view-productcategory")
    ) {
      setOpenMenu("productcategory");
    } else if (
      location.pathname.startsWith("/addproduct") ||
      location.pathname.startsWith("/viewproduct")
    ) {
      setOpenMenu("product");
    } else {
      setOpenMenu("");
    }
  }, [location.pathname]);

  const menuClass = (path) =>
    `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      location.pathname === path
        ? "border-l-2 border-teal-500 bg-teal-500/10 text-teal-500"
        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
    }`;

  const subMenuClass = (path) =>
    `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
      location.pathname === path
        ? "bg-teal-500/10 text-teal-500"
        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
    }`;

  return (
    <aside className="w-full min-h-screen bg-neutral-900 border-r border-neutral-800">
      {/* Logo */}
      <div className="flex items-center h-16 px-6">
        <img
          src="./assets/images/logo.png"
          alt="Logo"
          className="h-10 w-[220px] rounded-md"
        />
      </div>

      <nav className="px-3 py-4">
        <ul className="space-y-1">

          {/* Dashboard */}
          <li>
            <Link to="/dashboard" className={menuClass("/dashboard")}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          </li>

          {/* Categories */}
          <li>
            <button
              onClick={() => toggleMenu("category")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              <Tags size={18} />
              <span className="flex-1 text-left">Categories</span>
              <ChevronDown
                size={16}
                className={`transition duration-300 ${
                  openMenu === "category" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenu === "category" && (
              <ul className="ml-5 mt-1 space-y-1 border-l border-neutral-700 pl-4">
                <li>
                  <Link
                    to="/add-category"
                    className={subMenuClass("/add-category")}
                  >
                    <CirclePlus size={15} />
                    Add Category
                  </Link>
                </li>

                <li>
                  <Link
                    to="/view-category"
                    className={subMenuClass("/view-category")}
                  >
                    <Eye size={15} />
                    View Categories
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Sub Categories */}
          <li>
            <button
              onClick={() => toggleMenu("subcategory")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              <FolderTree size={18} />
              <span className="flex-1 text-left">Sub Categories</span>
              <ChevronDown
                size={16}
                className={`transition duration-300 ${
                  openMenu === "subcategory" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenu === "subcategory" && (
              <ul className="ml-5 mt-1 space-y-1 border-l border-neutral-700 pl-4">
                <li>
                  <Link
                    to="/add-subcategory"
                    className={subMenuClass("/add-subcategory")}
                  >
                    <CirclePlus size={15} />
                    Add Sub Category
                  </Link>
                </li>

                <li>
                  <Link
                    to="/view-subcategory"
                    className={subMenuClass("/view-subcategory")}
                  >
                    <Eye size={15} />
                    View Sub Categories
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Product Categories */}
          <li>
            <button
              onClick={() => toggleMenu("productcategory")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              <Layers3 size={18} />
              <span className="flex-1 text-left">Product Categories</span>
              <ChevronDown
                size={16}
                className={`transition duration-300 ${
                  openMenu === "productcategory" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenu === "productcategory" && (
              <ul className="ml-5 mt-1 space-y-1 border-l border-neutral-700 pl-4">
                <li>
                  <Link
                    to="/add-productcategory"
                    className={subMenuClass("/add-productcategory")}
                  >
                    <CirclePlus size={15} />
                    Add Product Category
                  </Link>
                </li>

                <li>
                  <Link
                    to="/view-productcategory"
                    className={subMenuClass("/view-productcategory")}
                  >
                    <Eye size={15} />
                    View Product Categories
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Products */}
          <li>
            <button
              onClick={() => toggleMenu("product")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              <ShoppingBag size={18} />
              <span className="flex-1 text-left">Products</span>
              <ChevronDown
                size={16}
                className={`transition duration-300 ${
                  openMenu === "product" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenu === "product" && (
              <ul className="ml-5 mt-1 space-y-1 border-l border-neutral-700 pl-4">
                <li>
                  <Link
                    to="/addproduct"
                    className={subMenuClass("/addproduct")}
                  >
                    <CirclePlus size={15} />
                    Add Product
                  </Link>
                </li>

                <li>
                  <Link
                    to="/viewproduct"
                    className={subMenuClass("/viewproduct")}
                  >
                    <Eye size={15} />
                    View Products
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Customers */}
          <li>
            <Link to="/users" className={menuClass("/users")}>
              <Users size={18} />
              Customers
            </Link>
          </li>

          {/* Orders */}
          <li>
            <Link to="/orders" className={menuClass("/orders")}>
              <Truck size={18} />
              Orders
            </Link>
          </li>

          {/* Coupons */}
          <li>
            <Link className={menuClass("/coupons")}>
              <Ticket size={18} />
              Coupons
            </Link>
          </li>

          {/* Staff */}
          <li>
            <Link  className={menuClass("/staff")}>
              <Briefcase size={18} />
              Staff
            </Link>
          </li>

        </ul>
      </nav>
    </aside>
  );
}