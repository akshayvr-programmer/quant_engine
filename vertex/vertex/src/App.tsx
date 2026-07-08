import { useState } from "react";

import AppLayout from "./layouts/AppLayout";

import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

import Dashboard from "./components/dashboard/Dashboard";
import OpenOrders from "./components/dashboard/OpenOrders";
import TradeTape from "./components/dashboard/TradeTape";
import PositionsTable from "./components/dashboard/PositionsTable";


import Card from "./components/ui/Card";

type Page =
    | "dashboard"
    | "orders"
    | "markets"
    | "portfolio"
    | "strategies";

export default function App() {

    const [page, setPage] =
        useState<Page>("dashboard");

    const renderPage = () => {

        switch (page) {

            case "orders":

                return (

                    <div className="flex h-full flex-col gap-6">

                        <div className="grid grid-cols-12 gap-6">

                            <Card
                                title="Open Orders"
                                className="col-span-6 h-[420px]"
                            >
                                <OpenOrders />
                            </Card>

                            <Card
                                title="Filled Orders"
                                className="col-span-6 h-[420px]"
                            >
                                <TradeTape />
                            </Card>

                        </div>

                        <Card
                            title="Positions"
                            className="h-[420px]"
                        >
                            <PositionsTable />
                        </Card>

                    </div>

                );

            case "markets":

                return (
                    <div className="text-[#A79B91]">
                        Markets coming soon...
                    </div>
                );

            case "portfolio":

                return (
                    <div className="text-[#A79B91]">
                        Portfolio coming soon...
                    </div>
                );

            case "strategies":

                return (
                    <div className="text-[#A79B91]">
                        Strategies coming soon...
                    </div>
                );

            default:

                return <Dashboard />;

        }

    };

    return (

        <AppLayout
            sidebar={
                <Sidebar
                    currentPage={page}
                    onNavigate={setPage}
                />
            }
            topbar={<Topbar />}
        >

            {renderPage()}

        </AppLayout>

    );

}