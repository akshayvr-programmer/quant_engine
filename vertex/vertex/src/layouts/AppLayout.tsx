type AppLayoutProps = {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
};

export default function AppLayout({
  sidebar,
  topbar,
  children,
}: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-[#171411] text-[#F5F1EB]">
      <aside className="w-72 border-r border-[#3C342E]">
        {sidebar}
      </aside>

      <main className="flex flex-1 flex-col">
        <header className="h-20 border-b border-[#3C342E]">
          {topbar}
        </header>

        <section className="flex-1 overflow-auto p-6">
          {children}
        </section>
      </main>
    </div>
  );
}
