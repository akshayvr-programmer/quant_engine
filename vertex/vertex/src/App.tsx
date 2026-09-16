import { useState } from "react";

import AppLayout from "./layouts/AppLayout";

import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

import Dashboard from "./components/dashboard/Dashboard";
import OpenOrders from "./components/dashboard/OpenOrders";
import TradeTape from "./components/dashboard/TradeTape";
import PositionsTable from "./components/dashboard/PositionsTable";
import MarketsView from "./components/dashboard/MarketsView";

import StrategiesTab from "./components/dashboard/StrategiesTab";
import AIAssistant from "./components/dashboard/AIAssistant";
import Card from "./components/ui/Card";
import AnalyticsView from "./components/dashboard/AnalyticsView";
import ReplayView from "./components/dashboard/ReplayView";


type Page =
    | "dashboard"
    | "orders"
    | "markets"
    | "strategies"
    | "analytics"
    | "replay"
    | "ai";

export default function App() {

    const [page, setPage] =
        useState<Page>("dashboard");

    const renderPage = () => {

        switch (page) {

            case "orders":

                return (

                    <div className="flex min-h-full flex-col gap-5">

                        <div className="grid grid-cols-12 gap-5">

                            <Card
                                title="Open Orders"
                                className="col-span-6 h-[360px]"
                            >
                                <OpenOrders />
                            </Card>

                            <Card
                                title="Filled Orders"
                                className="col-span-6 h-[360px]"
                            >
                                <TradeTape />
                            </Card>

                        </div>

                        <Card
                            title="Positions"
                            className="h-[360px]"
                        >
                            <PositionsTable />
                        </Card>

                    </div>

                );

            case "markets":

                return <MarketsView />;

            case "strategies":
                return <StrategiesTab />;
            
            case "ai":
                return <AIAssistant />;
            
            case "analytics":
                return <AnalyticsView />;
            
            case "replay":
                return <ReplayView />;
            
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
