export function formatAccount(account: any): string {

    return `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACCOUNT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Buying Power     $${Number(account.buyingPower).toLocaleString()}

Cash             $${Number(account.cash).toLocaleString()}

Equity           $${Number(account.equity).toLocaleString()}

Portfolio Value  $${Number(account.portfolioValue).toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();

}

export function formatPositions(positions: any[]): string {

    if (!positions.length) {

        return `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POSITIONS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No Open Positions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();

    }

    let output = `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POSITIONS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`.trim();

    positions.forEach(position => {

        output += `

${position.symbol}

Qty : ${position.quantity}

Avg : $${Number(position.averageCost).toFixed(2)}

PnL : $${Number(position.unrealizedPnL).toFixed(2)}

──────────────────────────────`;

    });

    return output;

}

export function formatOrders(orders: any[]): string {

    if (!orders.length) {

        return `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPEN ORDERS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No Open Orders

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();

    }

    let output = `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPEN ORDERS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`.trim();

    orders.forEach(order => {

        output += `

${order.side.toUpperCase()} ${order.symbol}

${order.quantity} shares

${order.type.toUpperCase()}

${order.limitPrice > 0

    ? `$${order.limitPrice}`

    : "Market"}

──────────────────────────────`;

    });

    return output;

}