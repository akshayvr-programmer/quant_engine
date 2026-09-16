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
    <div className="flex h-screen overflow-hidden bg-[#171411] text-[#F5F1EB]">
      <aside className="w-64 shrink-0 border-r border-[#3C342E]">
        {sidebar}
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="h-16 shrink-0 border-b border-[#3C342E]">
          {topbar}
        </header>

        <section className="scroll-area min-h-0 flex-1 p-5">
          {children}
        </section>
      </main>
    </div>
  );
}
