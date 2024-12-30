export const Footer = () => {
    return (
        <footer className="flex flex-row w-full mt-8 px-8 py-4 gap-8 items-center bg-white border-t border-zinc-900/15">
            <p className="text-zinc-400 text-sm">
                Made by Sebastian Wirkijowski. Powered by Next.js and GraphQL. Version {process.env.npm_package_version}.
            </p>
        </footer>
    )
}