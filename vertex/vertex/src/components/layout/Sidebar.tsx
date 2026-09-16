import {
    LayoutDashboard,
    ChartCandlestick,
    ReceiptText,
    Brain,
    BarChart3,
    FlaskConical,
    MessageSquare,
    type LucideIcon,
} from "lucide-react";

type Page =
    | "dashboard"
    | "markets"
    | "orders"
    | "strategies"
    | "analytics"
    | "replay"
    | "ai";


interface SidebarProps {

    currentPage: Page;

    onNavigate: (page: Page) => void;

}

const items: {

    icon: LucideIcon;

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
        icon: FlaskConical,
        label: "Replay Lab",
        page: "replay",
    },
];

export default function Sidebar({

    currentPage,

    onNavigate,

}: SidebarProps) {

    return (

        <div className="flex h-full min-h-0 flex-col">

            <div className="px-6 py-6">

                <h1 className="text-2xl font-bold tracking-tight text-[#D6A15F]">

                    Vertex

                </h1>

                <p className="mt-2 text-sm text-[#A79B91]">

                    Quant Trading Terminal

                </p>

            </div>

            <nav className="scroll-area min-h-0 flex-1 px-3">

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

                        className={`mb-1.5 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200

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

            <div className="border-t border-[#3C342E] p-5">

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
