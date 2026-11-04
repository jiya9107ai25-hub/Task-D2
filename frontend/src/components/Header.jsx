import { Link } from 'react-router-dom'

function Header({ user, onLogout }) {
    return (
        <header className="bg-gray-100 border-b border-gray-300">

            <nav className="flex items-center gap-4 px-8 py-3">

                <Link
                    to="/"
                    className="font-bold text-xl text-gray-900 whitespace-nowrap"
                >
                    DEV@Deakin
                </Link>

                <div className="w-56">
                    <input
                        type="text"
                        placeholder="Search..."
                        aria-label="Search"
                        className="w-full bg-white border border-gray-300 px-4 py-2 outline-none"
                    />
                </div>

                <Link
                    to="/post"
                    className="ml-auto text-gray-900 font-medium px-3 hover:text-blue-600"
                >
                    Post
                </Link>

                <Link
                    to="/browse-posts"
                    className="text-gray-900 font-medium px-3 hover:text-blue-600"
                >
                    Browse Posts
                </Link>

                <Link
                    to="/pricing"
                    className="text-gray-900 font-medium px-3 hover:text-blue-600"
                >
                    Pricing
                </Link>

                {user ? (
                    <>
                        <span className="text-sm text-blue-600">
                            {user.email}
                        </span>

                        <button
                            type="button"
                            onClick={onLogout}
                            className="text-gray-900 font-medium px-3 hover:text-blue-600"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="text-gray-900 font-medium px-3 hover:text-blue-600"
                    >
                        Login
                    </Link>
                )}

            </nav>

        </header>
    )
}

export default Header