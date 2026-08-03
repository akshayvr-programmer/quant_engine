import {
    LayoutDashboard,
    ChartCandlestick,
    Briefcase,
    ReceiptText,
    Brain,
    BarChart3,
    Shield,
    History,
    Settings, MessageSquare
} from "lucide-react";

type Page =
    | "dashboard"
    | "markets"
    | "portfolio"
    | "orders"
    | "strategies"
    | "analytics"
    | "risk"
    | "replay"
    | "settings"
    | "ai";


interface SidebarProps {

    currentPage: Page;

    onNavigate: (page: Page) => void;

}

const items: {

    icon: any;

    label: string;

    page: Page;

}[] = [

    {
        icon: LayoutDashboard,
        label: "Dashboard",
        page: "dashboard",
    },

    {
        icon: ChartCandlestick,
        label: "Markets",
        page: "markets",
    },

    {
        icon: Briefcase,
        label: "Portfolio",
        page: "portfolio",
    },

    {
        icon: ReceiptText,
        label: "Orders",
        page: "orders",
    },

    {
        icon: Brain,
        label: "Strategies",
        page: "strategies",
    },
    {
    icon: MessageSquare,
    label: "AI Assistant",
    page: "ai",
    },

    {
        icon: BarChart3,
        label: "Analytics",
        page: "analytics",
    },

    {
        icon: Shield,
        label: "Risk",
        page: "risk",
    },

    {
        icon: History,
        label: "Replay",
        page: "replay",
    },

    {
        icon: Settings,
        label: "Settings",
        page: "settings",
    },

];

export default function Sidebar({

    currentPage,

    onNavigate,

}: SidebarProps) {

    return (

        <div className="flex h-full flex-col">

            <div className="px-8 py-8">

                <h1 className="text-3xl font-bold tracking-tight text-[#D6A15F]">

                    Vertex

                </h1>

                <p className="mt-2 text-sm text-[#A79B91]">

                    Quant Trading Terminal

                </p>

            </div>

            <nav className="flex-1 px-4">

                {items.map(({

                    icon: Icon,

                    label,

                    page,

                }) => (

                    <button

                        key={page}

                        onClick={() =>

                            onNavigate(page)

                        }

                        className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200

                        ${
                            currentPage === page

                                ? "bg-[#D6A15F] text-[#171411] font-semibold"

                                : "text-[#E5DED6] hover:bg-[#2A2420] hover:text-white"
                        }`}

                    >

                        <Icon size={18} />

                        {label}

                    </button>

                ))}

            </nav>

            <div className="border-t border-[#3C342E] p-6">

                <div className="text-sm text-[#A79B91]">

                    Connected

                </div>

                <div className="mt-2 flex items-center gap-2">

                    <div className="h-2 w-2 rounded-full bg-green-400" />

                    <span>

                        Alpaca Paper

                    </span>

                </div>

            </div>

        </div>

    );

}