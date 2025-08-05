import { PlusIcon } from "lucide-react";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
            Ayaan Flights
          </h1>
          <div className="flex items-center gap-4">
            <Link to={"/review"} className="btn btn-primary flex items-center gap-2">
              <PlusIcon className="size-5" />
              <span>Reviews</span>
            </Link>
            <Link to={"/profile"} className="btn btn-secondary flex items-center gap-2">
              <PlusIcon className="size-5" />
              <span>User Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
