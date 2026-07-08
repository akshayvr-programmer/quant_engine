export interface CommandResult {

    output?: string;

    command?: string;

    args?: string[];

    clear?: boolean;

}

export function parseCommand(command: string): CommandResult {

    const input = command.trim();

    if (!input) {
        return { output: "" };
    }

    const tokens = input.split(/\s+/);

    switch (tokens[0].toLowerCase()) {

        case "help":
            return {
                output: `
Available Commands

help
account
positions
orders
buy <symbol> <qty> market
sell <symbol> <qty> market
clear
`.trim()
            };

        case "account":
            return {
                command: "account"
            };

        case "positions":
            return {
                command: "positions"
            };

        case "orders":
            return {
                command: "orders"
            };

        case "buy":
            return {
                command: "buy", 
                args: tokens
            };

        case "sell":
            return {
                command: "sell", 
                args: tokens
                
            };

        case "clear":
            return {
                output: "",
                clear: true
            };

        default:
            return {
                output: `Unknown command: ${tokens[0]}`
            };
    }

}