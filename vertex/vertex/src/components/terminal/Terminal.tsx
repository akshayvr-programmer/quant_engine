import { useEffect, useRef, useState } from "react";

import { parseCommand } from "./CommandParser";
import Prompt from "./Prompt";

import {
    terminalAccount,
    terminalPositions,
    terminalOrders,
    terminalBuy,
    terminalSell,
} from "../../services/terminal";

import {
    formatAccount,
    formatPositions,
    formatOrders,
} from "./TerminalFormatter";

type TerminalProps = {
    compact?: boolean;
};

export default function Terminal({ compact = false }: TerminalProps) {

    const [history, setHistory] = useState<string[]>([
        "Vertex Terminal v1.2",
        "Connected to Alpaca Paper",
        "Try: account, positions, orders, buy AAPL 10 market",
]);


    const [command, setCommand] = useState("");

    const [historyIndex, setHistoryIndex] = useState(-1);

    const [isExecuting, setIsExecuting] = useState(false);

    const historyRef = useRef<HTMLDivElement>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const commandHistory = history.filter(line =>
        line.startsWith("> ")
    );

    useEffect(() => {

        historyRef.current?.scrollTo({

            top: historyRef.current.scrollHeight,

            behavior: "smooth",

        });

    }, [history]);

    async function execute() {

        if (!command.trim()) return;

        if (isExecuting) return;

        setIsExecuting(true);

        try {

            const result = parseCommand(command);

            if (result.clear) {

                setHistory([]);

                setCommand("");

                inputRef.current?.focus();

                return;

            }

            if (result.command === "account") {

                const account =
                    await terminalAccount();

                setHistory(prev => [

                    ...prev,

                    `> ${command}`,

                    formatAccount(account),

                ]);

                setCommand("");

                inputRef.current?.focus();

                return;

            }

            if (result.command === "positions") {

                const positions =
                    await terminalPositions();

                setHistory(prev => [

                    ...prev,

                    `> ${command}`,

                    formatPositions(positions),

                ]);

                setCommand("");

                inputRef.current?.focus();

                return;

            }

            if (result.command === "orders") {

                const orders =
                    await terminalOrders();

                setHistory(prev => [

                    ...prev,

                    `> ${command}`,

                    formatOrders(orders),

                ]);

                setCommand("");

                inputRef.current?.focus();

                return;

            }

            if (result.command === "buy") {

                await terminalBuy(

                    result.args![1],

                    Number(result.args![2])

                );

                setHistory(prev => [

                    ...prev,

                    `> ${command}`,

                    `✓ BUY ${result.args![2]} ${result.args![1]} @ MARKET`,

                ]);

                setCommand("");

                inputRef.current?.focus();

                return;

            }

            if (result.command === "sell") {

                await terminalSell(

                    result.args![1],

                    Number(result.args![2])

                );

                setHistory(prev => [

                    ...prev,

                    `> ${command}`,

                    `✓ SELL ${result.args![2]} ${result.args![1]} @ MARKET`,

                ]);

                setCommand("");

                inputRef.current?.focus();

                return;

            }

            setHistory(prev => [

                ...prev,

                `> ${command}`,

                result.output ?? "",

            ]);

            setCommand("");

            inputRef.current?.focus();

        }

        catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Command failed";

            setHistory(prev => [

                ...prev,

                `> ${command}`,

                `❌ ${message}`,

            ]);

            setCommand("");

            inputRef.current?.focus();

        }

        finally {

            setIsExecuting(false);

        }

    }

    return (

        <div className="flex h-full min-h-0 flex-col rounded-lg bg-[#14110F] p-3 font-mono">

            <div
                ref={historyRef}
                className={`scroll-area flex-1 whitespace-pre-wrap pr-2 ${
                    compact ? "text-xs leading-5" : "text-sm"
                }`}
            >

                {history.map((line, index) => (

                    <div
                        key={index}
                        className="mb-2 text-[#D7D2CC]"
                    >
                        {line}
                    </div>

                ))}

            </div>

            <div className="mt-3 flex items-center border-t border-[#2A2420] pt-3">
                <Prompt executing={isExecuting} />


                <input

                    ref={inputRef}

                    value={command}

                    disabled={isExecuting}

                    onChange={(e) =>
                        setCommand(e.target.value)
                    }

                    onKeyDown={(e) => {

                        if (e.key === "Enter") {

                            execute();

                            setHistoryIndex(-1);

                        }

                        if (e.key === "ArrowUp") {

                            e.preventDefault();

                            if (!commandHistory.length) return;

                            const next = Math.min(

                                historyIndex + 1,

                                commandHistory.length - 1

                            );

                            setHistoryIndex(next);

                            setCommand(

                                commandHistory[
                                    commandHistory.length - 1 - next
                                ].substring(2)

                            );

                        }

                        if (e.key === "ArrowDown") {

                            e.preventDefault();

                            if (historyIndex <= 0) {

                                setHistoryIndex(-1);

                                setCommand("");

                                return;

                            }

                            const next = historyIndex - 1;

                            setHistoryIndex(next);

                            setCommand(

                                commandHistory[
                                    commandHistory.length - 1 - next
                                ].substring(2)

                            );

                        }

                    }}

                    className="ml-3 flex-1 bg-transparent font-mono text-white caret-[#D6A15F] outline-none disabled:opacity-60"


                    placeholder={
                        isExecuting
                            ? "Executing..."
                            : "help"
                    }

                    autoFocus

                />

            </div>

        </div>

    );

}
