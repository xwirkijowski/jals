import Link from "next/link";

export const Header = () => {
    return (
        <header className="flex flex-row w-full px-8 py-4 gap-8 mb-8 bg-white border-b-2 border-orange-500">
            <div className="flex flex-row flex-0 items-center gap-4 text-zinc-600">
                <h1 className="text-xl font-bold text-zinc-900"><Link href={'/'}>JALS
                    <span className="text-orange-500">v2</span></Link></h1>
                <p className="pointer-events-none hidden sm:block">Just Another Link Shortener</p>
            </div>
            <nav className="flex flex-row flex-1 justify-end">
                <ul className="flex flex-row gap-0">
                    <li className="p-2">Log in</li>
                    <li className="p-2">Register</li>
                </ul>
            </nav>
        </header>
    )
}