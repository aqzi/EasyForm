export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            <div className="flex flex-col flex-1">
                <main className="flex-1 p-4 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}